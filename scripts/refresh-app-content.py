#!/usr/bin/env python3
"""Publish an immutable app inventory from HEAD; preserve old versions and video metadata."""
import argparse, hashlib, json, mimetypes, subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--cache-root', type=Path)
args = parser.parse_args()
root = Path(subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], text=True).strip())
def git(*cmd):
    return subprocess.check_output(['git', *cmd], cwd=root)
def digest(data):
    return hashlib.sha256(data).hexdigest()
def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
def blob_valid(data, oid):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest() == oid

base = root / 'app-content'
previous = json.loads((base / 'latest.json').read_text())
old = json.loads((base / previous['release_id'] / 'manifest.json').read_text())
video = json.loads((base / previous['release_id'] / 'videos.json').read_text())
commit = git('rev-parse', 'HEAD').decode().strip()
release = commit
folder = base / release
if folder.exists():
    raise SystemExit('Immutable release already exists; refusing overwrite')
allowed = {'.html','.js','.css','.json','.webmanifest','.svg','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf','.mp3','.wav','.ogg','.pdf'}
excluded = {'audio/no-ar.mp3','audio/no-en.mp3','audio/ok-ar.mp3','audio/ok-en.mp3'}
mime = {'.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.mp3':'audio/mpeg','.wav':'audio/wav','.webmanifest':'application/manifest+json','.js':'text/javascript','.json':'application/json'}
assets = []
for row in git('ls-tree', '-r', '-z', commit).split(b'\0'):
    if not row:
        continue
    meta, name = row.split(b'\t', 1)
    mode, kind, oid = meta.decode().split()
    path = name.decode()
    ext = Path(path).suffix.lower()
    if kind != 'blob' or path.startswith(('.', 'app-content/')):
        continue
    if not (ext in allowed or path in {'CNAME','robots.txt'} or (path.startswith('assets/') and ext == '.mp4')):
        continue
    data = None
    if args.cache_root:
        cached = args.cache_root / path
        if cached.is_file():
            candidate = cached.read_bytes()
            if blob_valid(candidate, oid):
                data = candidate
    if data is None:
        data = git('cat-file', 'blob', oid)
    if not blob_valid(data, oid):
        raise SystemExit('Git blob verification failed: ' + path)
    assets.append({'required_for_app':path not in excluded,'bundle_recommendation':'exclude-superseded' if path in excluded else 'bundle','path':path,'url':old['base_url']+path,'immutable_url':'https://raw.githubusercontent.com/basemhreaz-cloud/english-savant/'+commit+'/'+path,'bytes':len(data),'sha256':digest(data),'git_blob_sha1':oid,'mime':mime.get(ext,mimetypes.guess_type(path)[0] or 'application/octet-stream'),'role':'learning-animation' if ext=='.mp4' else 'static-content'})
assets.sort(key=lambda x:x['path'])
assert len(assets) > 2500
video['release_id'] = release
write(folder / 'videos.json', video)
vb = (folder / 'videos.json').read_bytes()
manifest = dict(old)
manifest.update(release_id=release,content_version='git-'+release,source_tree_sha=commit,source_commit=commit,metadata_revision=2,generator='scripts/refresh-app-content.py',status='complete',assets=assets,asset_count=len(assets),total_bytes=sum(x['bytes'] for x in assets),entrypoints=[x['path'] for x in assets if x['path'].endswith('.html')],deleted_paths=sorted({x['path'] for x in old['assets']}-{x['path'] for x in assets}),deletion_baseline=previous['release_id'],failures=[],required_for_app_bytes=sum(x['bytes'] for x in assets if x['required_for_app']),total_bytes_without_confirmed_exclusions=sum(x['bytes'] for x in assets if x['required_for_app']),video_inventory_url=old['base_url']+'app-content/'+release+'/videos.json',video_inventory_sha256=digest(vb),video_inventory_bytes=len(vb))
write(folder / 'manifest.json', manifest)
mb = (folder / 'manifest.json').read_bytes()
pointer = dict(previous)
pointer.update(release_id=release,content_version='git-'+release,previous_release_id=previous['release_id'],manifest_url=old['base_url']+'app-content/'+release+'/manifest.json',manifest_sha256=digest(mb),manifest_bytes=len(mb),asset_count=len(assets),total_bytes=manifest['total_bytes'],video_inventory_url=manifest['video_inventory_url'],video_inventory_sha256=digest(vb),video_inventory_bytes=len(vb))
write(base / 'latest.json', pointer)
print(json.dumps({'release_id':release,'assets':len(assets),'bytes':manifest['total_bytes'],'manifest_sha256':digest(mb)}))
