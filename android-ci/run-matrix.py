import os,subprocess,time,xml.etree.ElementTree as ET
from pathlib import Path
O=Path('android-evidence');O.mkdir(exist_ok=True)
def adb(*a,check=True,timeout=240):
 p=subprocess.run(['adb',*a],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=timeout)
 if check and p.returncode:raise RuntimeError(p.stdout.decode(errors='replace'))
 return p.stdout
try:
 adb('root');adb('wait-for-device');adb('shell','input','keyevent','82');adb('logcat','-c')
 for apk in ['android-ci/current-test-signed.apk','android-ci/matrix-audit.apk']:print(adb('install','-r',apk).decode())
 w,h=(411,891) if os.environ['DEVICE']=='phone' else (800,1280)
 adb('shell','wm','size',f'{w}x{h}');adb('shell','wm','density','160');adb('shell','settings','put','system','font_scale','1.0')
 for lang in ['ar','en']:
  p=O/('pdf-'+os.environ['DEVICE']+'-'+lang);p.mkdir(exist_ok=True)
  adb('shell','am','force-stop','eg.englishsavant.app');adb('shell','rm','-rf','/data/data/eg.englishsavant.app/files/matrix',check=False)
  output=adb('shell','am','instrument','-w','-e','language',lang,'eg.englishsavant.matrix/.MatrixAudit',timeout=300,check=False);(p/'instrument.txt').write_bytes(output)
  time.sleep(10);(p/'native-pdf.png').write_bytes(adb('exec-out','screencap','-p'));adb('shell','uiautomator','dump','/sdcard/window.xml',check=False);xml=adb('shell','cat','/sdcard/window.xml',check=False);(p/'native-window.xml').write_bytes(xml)
  print(lang,xml.decode(errors='replace')[-4000:],flush=True)
  try:
   tree=ET.fromstring(xml);nodes=tree.findall('.//node');target=next((n for n in nodes if n.get('text','').strip().lower() in ['next','التالي','التالية']),None)
   if target is not None:
    import re
    x1,y1,x2,y2=map(int,re.findall(r'\d+',target.get('bounds')));adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));time.sleep(2);(p/'native-pdf-next.png').write_bytes(adb('exec-out','screencap','-p'))
  except Exception as e:(p/'next-error.txt').write_text(str(e))
  adb('pull','/data/data/eg.englishsavant.app/files/matrix',str(p),check=False)
finally:
 (O/'logcat.txt').write_bytes(adb('logcat','-d','-t','1200',check=False));adb('shell','wm','size','reset',check=False);adb('shell','wm','density','reset',check=False)
