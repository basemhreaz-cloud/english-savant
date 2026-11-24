#!/usr/bin/env python3
"""Generate immutable English Savant full-content inventory from a pinned Git commit.
No writes to repository or site. Downloaded bytes verified against Git blob identity.
"""
import argparse,concurrent.futures,hashlib,json,mimetypes,time,urllib.request
from pathlib import Path
P=argparse.ArgumentParser();P.add_argument('--commit',required=True);P.add_argument('--tree',required=True);P.add_argument('--output',required=True);P.add_argument('--previous');P.add_argument('--workers',type=int,default=12);a=P.parse_args()
out=Path(a.output);out.mkdir(parents=True,exist_ok=True);store=out/'verified-content';store.mkdir(exist_ok=True)
tree=json.load(open(a.tree));assert not tree.get('truncated');assert tree['sha']==a.commit
allowed={'.html','.js','.css','.json','.webmanifest','.svg','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf','.mp3','.wav','.ogg','.pdf'}
rows=[x for x in tree['tree'] if x['type']=='blob' and not x['path'].startswith(('.', 'app-content/')) and (Path(x['path']).suffix.lower() in allowed or x['path'] in ['CNAME','robots.txt'])]
# Small in-lesson tracing animations are learning dependencies, not long-form lesson videos.
rows += [x for x in tree['tree'] if x['type']=='blob' and x['path'].startswith('assets/') and x['path'].endswith('.mp4')]
def one(x):
 path=x['path'];f=store/path;f.parent.mkdir(parents=True,exist_ok=True);data=f.read_bytes() if f.exists() else None
 def valid(b):return b is not None and len(b)==x['size'] and hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==x['sha']
 if not valid(data):
  for trial in range(4):
   try:
    req=urllib.request.Request('https://raw.githubusercontent.com/basemhreaz-cloud/english-savant/'+a.commit+'/'+path,headers={'User-Agent':'English-Savant-content-audit'})
    with urllib.request.urlopen(req,timeout=35) as r:data=r.read()
    if not valid(data):raise ValueError('Git blob verification failed '+path)
    f.write_bytes(data);break
   except Exception:
    if trial==3:raise
    time.sleep(trial+1)
 return {'required_for_app':path not in {'audio/no-ar.mp3','audio/no-en.mp3','audio/ok-ar.mp3','audio/ok-en.mp3'},'bundle_recommendation':'exclude-superseded' if path in {'audio/no-ar.mp3','audio/no-en.mp3','audio/ok-ar.mp3','audio/ok-en.mp3'} else 'bundle','path':path,'url':'https://basemhreaz-cloud.github.io/english-savant/'+path,'immutable_url':'https://raw.githubusercontent.com/basemhreaz-cloud/english-savant/'+a.commit+'/'+path,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'git_blob_sha1':x['sha'],'mime':mimetypes.guess_type(path)[0] or 'application/octet-stream','role':'learning-animation' if path.endswith('.mp4') else 'static-content'}
result=[];fail=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as pool:
 jobs={pool.submit(one,x):x for x in rows}
 for f in concurrent.futures.as_completed(jobs):
  try:result.append(f.result())
  except Exception as e:fail.append({'path':jobs[f]['path'],'error':str(e)})
  if (len(result)+len(fail))%100==0:print('verified',len(result),'fail',len(fail),'/',len(rows),flush=True)
result.sort(key=lambda x:x['path']);previous=json.load(open(a.previous)) if a.previous else None
manifest={'schema_version':1,'release_id':a.commit,'content_version':'git-'+a.commit,'status':'complete' if not fail else 'incomplete-do-not-activate','base_url':'https://basemhreaz-cloud.github.io/english-savant/','source_tree_sha':tree['sha'],'asset_count':len(result),'total_bytes':sum(x['bytes'] for x in result),'entrypoints':[x['path'] for x in result if x['path'].endswith('.html')],'assets':result,'deleted_paths':sorted(set(x['path'] for x in previous['assets'])-set(x['path'] for x in result)) if previous else [],'deletion_baseline':'previous manifest' if previous else 'first release, no previous manifest supplied; no deletions authorized','failures':fail,'total_bytes_without_confirmed_exclusions':sum(x['bytes'] for x in result if x['required_for_app']),'required_network_features':['AI coach POST','generated Achird speech POST','external navigation','lesson video on first play'],'notes':['All committed static learning files included, not a home-link crawl.','Tracing animation MP4s under assets/ are mandatory offline learning files. Long-form lesson videos are separate.','Do not activate until every asset hash verifies on the phone. Retain prior complete version during rollout.','Exact query URL aliases and app interception policy must resolve to this versioned canonical asset map.','Immutable source URLs retained per release; do not replace old files in an existing pack.']}
(out/'content-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(out/'video-files.json').write_text(json.dumps({'release_id':a.commit,'files':[{'path':x['path'],'bytes':x['size'],'git_blob_sha1':x['sha'],'mime':'video/mp4'} for x in tree['tree'] if x['type']=='blob' and x['path'].endswith('.mp4') and not x['path'].startswith('assets/')]},indent=2))
print('DONE',manifest['status'],len(result),manifest['total_bytes'],fail,flush=True)
