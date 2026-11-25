import base64,pathlib,hashlib,json,gzip
for p in sorted(pathlib.Path('gate-evidence').glob('*')):
 if p.is_file():
  b=p.read_bytes();encoded=base64.b64encode(gzip.compress(b)).decode()
  print('ES_EVIDENCE_BEGIN '+json.dumps({'name':p.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}))
  for i in range(0,len(encoded),8000):print('ES_DATA '+encoded[i:i+8000])
  print('ES_EVIDENCE_END')
