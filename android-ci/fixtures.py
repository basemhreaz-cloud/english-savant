#!/usr/bin/env python3
"""Publisher-run, local-only update fixture. Never uploads or changes a remote pointer."""
import json,hashlib,zipfile,threading,urllib.parse,socket
from pathlib import Path
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
BASE='https://basemhreaz-cloud.github.io/english-savant/'
def digest(b):return hashlib.sha256(b).hexdigest()
def prepare(apk):
 with zipfile.ZipFile(apk) as z:
  original=z.read('assets/content-manifest.json');m=json.loads(original);core=zipfile.ZipFile(__import__('io').BytesIO(z.read('assets/initial-content.zip')))
  assert m['release_sequence']==14
  index=next(a for a in m['assets'] if a['path']=='index.html');oldhash=index['sha256'];old=core.read('.objects/'+oldhash)
  changed=old.replace(b'<head>',b'<head><meta name="audit-release" content="fixture15">',1);assert changed!=old
  routes={};routes[index['immutable_url']+'?audit=full']=changed;routes[index['immutable_url']+'?audit=corrupt']=b'x'*len(changed);routes[index['immutable_url']+'?audit=interrupt']=changed
  def pointer(manifest,path,seq):
   raw=json.dumps(manifest,separators=(',',':'),ensure_ascii=False).encode();url=BASE+'app-content/audit-local/'+path+'/manifest.json';routes[url]=raw
   return json.dumps(dict(schema_version=1,release_id=manifest['release_id'],release_sequence=seq,manifest_url=url,manifest_bytes=len(raw),manifest_sha256=digest(raw),minimum_app_content_schema=1),separators=(',',':')).encode()
  baseline=pointer(m,'baseline',14);routes[BASE+'app-content/latest.json']=baseline;routes[BASE+'app-content/audit-local/baseline/latest.json']=baseline
  for mode in ['interrupt','corrupt','full']:
   n=json.loads(original);n['release_id']='f'*40;n['release_sequence']=15;n['source_tree_sha']=m['release_id'][:40]
   for a in n['assets']:
    if a['sha256']==oldhash:a.update(sha256=digest(changed),bytes=len(changed),immutable_url=index['immutable_url']+'?audit='+mode)
   n['total_bytes']=sum(a['bytes'] for a in n['assets']);routes[BASE+'app-content/audit-local/'+mode+'/latest.json']=pointer(n,mode,15)
  good=routes[BASE+'app-content/audit-local/full/latest.json'];bad=json.loads(good);bad['manifest_sha256']='0'*64;routes[BASE+'app-content/audit-local/badmeta/latest.json']=json.dumps(bad).encode()
  return routes
class H(BaseHTTPRequestHandler):
 routes={};requests=[]
 def do_GET(self):
  url=urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query).get('url',[''])[0];data=self.routes.get(url);rng=self.headers.get('Range');self.requests.append(dict(url=url,range=rng));Path('/tmp/update-fixture-requests.json').write_text(json.dumps(self.requests,indent=2))
  if data is None:self.send_error(404,'Fixture has no mapping');return
  offset=int(rng[6:-1]) if rng and rng.startswith('bytes=') and rng.endswith('-') else 0
  if '?audit=interrupt' in url:
   self.send_response(200);self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data[:max(1024,len(data)//3)]);self.wfile.flush();self.close_connection=True;return
  self.send_response(206 if offset else 200);self.send_header('Content-Length',str(len(data)-offset))
  if offset:self.send_header('Content-Range',f'bytes {offset}-{len(data)-1}/{len(data)}')
  self.end_headers();self.wfile.write(data[offset:])
 def log_message(self,*args):pass
if __name__=='__main__':
 import sys
 H.routes=prepare(sys.argv[1]);Path('/tmp/audit-fixture-info.json').write_text(json.dumps({'routes':list(H.routes),'count':len(H.routes)},indent=2));ThreadingHTTPServer(('127.0.0.1',18766),H).serve_forever()
