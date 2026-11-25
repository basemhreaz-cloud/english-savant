#!/usr/bin/env python3
import os,subprocess,time,json,hashlib,zipfile,shutil
from pathlib import Path
O=Path('android-evidence');O.mkdir(exist_ok=True)
def adb(*a,check=True,timeout=240):
 p=subprocess.run(['adb',*a],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=timeout)
 if check and p.returncode:raise RuntimeError(p.stdout.decode(errors='replace'))
 return p.stdout
api=os.environ['API'];device=os.environ['DEVICE']
try:
 for i in range(120):
  if adb('shell','getprop','sys.boot_completed',check=False).strip()==b'1':break
  time.sleep(2)
 adb('root');adb('wait-for-device');adb('shell','svc','power','stayon','true');adb('shell','input','keyevent','82');adb('logcat','-c');adb('shell','svc','wifi','disable');adb('shell','svc','data','disable')
 (O/'device.txt').write_bytes(adb('shell','getprop'))
 (O/'webview.txt').write_bytes(adb('shell','dumpsys','webviewupdate'))
 for apk in ['android-ci/current-test-signed.apk','android-ci/matrix-audit.apk']:print(adb('install','-r',apk).decode())
 (O/'installed-package.txt').write_bytes(adb('shell','dumpsys','package','eg.englishsavant.app'))
 sizes=[(1080,2400)] if device=='phone' else [(1536,2048)]
 for width,height in sizes:
  for rotation in [0,1]:
   label=f'api{api}-{device}-{width}x{height}-rotation{rotation}';p=O/label;p.mkdir()
   adb('shell','am','force-stop','eg.englishsavant.app');adb('shell','settings','put','system','accelerometer_rotation','0');adb('shell','settings','put','system','user_rotation',str(rotation));adb('shell','wm','size','reset');adb('shell','wm','density','reset');time.sleep(2);adb('shell','rm','-rf','/data/data/eg.englishsavant.app/files/matrix',check=False)
   output=adb('shell','am','instrument','-w','-e','width',str(width),'-e','height',str(height),'-e','rotation',str(rotation),'eg.englishsavant.matrix/.MatrixAudit',timeout=600,check=False)
   (p/'instrument.txt').write_bytes(output)
   print(output.decode(errors='replace')[-1500:],flush=True)
   (p/'unconditional-emulator-screen.png').write_bytes(adb('exec-out','screencap','-p'))
   adb('pull','/data/data/eg.englishsavant.app/files/matrix',str(p))
   assert not list(p.rglob('harness-error.txt')), 'Harness failed, inspect artifact'
   assert len(list(p.rglob('header-state-*.json')))==4, 'Missing header states'
   assert len(list(p.rglob('menu-state-*.json')))==4, 'Missing menu states'
   assert len(list(p.rglob('search-state-*.json')))==4, 'Missing search states'
   (p/'display.txt').write_bytes(adb('shell','dumpsys','display'))
   (p/'window.txt').write_bytes(adb('shell','dumpsys','window'))
   print(label, len(list(p.rglob('*.png'))),'screenshots',flush=True)
finally:
 (O/'logcat.txt').write_bytes(adb('logcat','-d',check=False)[-6000000:])
 (O/'eszoom.txt').write_bytes(adb('logcat','-d','-s','ESZOOM:V','*:S',check=False))
 adb('shell','wm','size','reset',check=False);adb('shell','wm','density','reset',check=False);adb('shell','settings','put','system','font_scale','1.0',check=False)
 # Do not retain huge unreviewable payloads.
 total=sum(p.stat().st_size for p in O.rglob('*') if p.is_file());print('Evidence bytes',total);assert total<200*1024*1024
