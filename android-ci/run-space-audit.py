#!/usr/bin/env python3
import subprocess,time,sys,shutil,json
from pathlib import Path
O=Path('android-evidence');O.mkdir(exist_ok=True);filler='/data/local/tmp/savant-lowspace-filler';proc=None;server=None
assert shutil.disk_usage('.').free>7*1024**3,'Host safety reserve <7GiB'
def adb(*a,timeout=180,check=True):
 p=subprocess.run(['adb',*a],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=timeout)
 if check and p.returncode:raise RuntimeError(p.stdout.decode(errors='replace'))
 return p.stdout
def wait(name):
 for i in range(240):
  if adb('shell','ls',f'/data/data/eg.englishsavant.app/files/{name}',check=False).startswith(b'/data/'):return
  if proc.poll() is not None:raise RuntimeError('Test ended before '+name)
  time.sleep(.5)
 raise RuntimeError('Timeout '+name)
try:
 (O/'host-disk-before.txt').write_bytes(subprocess.check_output(['df','-k','.']))
 server=subprocess.Popen([sys.executable,'android-ci/fixtures.py','/tmp/savant-test.apk'],stdout=open(O/'server.txt','w'),stderr=subprocess.STDOUT)
 adb('root');adb('wait-for-device');assert adb('shell','id').startswith(b'uid=0');adb('reverse','tcp:18766','tcp:18766')
 (O/'device-disk-before.txt').write_bytes(adb('shell','df','-k','/data'))
 for p in ['/tmp/savant-test.apk','android-ci/Savant-Space-Audit.apk']:print(adb('install','-r',p).decode())
 adb('shell','pm','clear','eg.englishsavant.app');adb('shell','svc','wifi','disable');adb('shell','svc','data','disable');adb('logcat','-c')
 stream=open(O/'instrument.txt','wb');proc=subprocess.Popen(['adb','shell','am','instrument','-w','eg.englishsavant.audit/eg.englishsavant.audit.SpaceAudit'],stdout=stream,stderr=subprocess.STDOUT)
 wait('lowspace-ready')
 blocks,size=map(int,adb('shell','stat','-f','-c','%a %S','/data').split());available=blocks*size;fill=(available-24*1024**2)//1048576
 assert 0<fill<4096,'Safety: filler outside0..4096MiB'
 adb('shell','dd','if=/dev/zero','of='+filler,'bs=1048576','count='+str(fill),'conv=fsync',timeout=180)
 (O/'disk-pressure.txt').write_bytes(adb('shell','df','-k','/data'));adb('shell','touch','/data/data/eg.englishsavant.app/files/lowspace-go');wait('lowspace-release')
 adb('shell','rm','-f',filler);adb('shell','sync');adb('shell','touch','/data/data/eg.englishsavant.app/files/lowspace-retry');proc.wait(timeout=180);stream.close()
 adb('pull','/data/data/eg.englishsavant.app/files/update-audit',str(O/'space'));data=(O/'instrument.txt').read_bytes();print(data.decode(errors='replace'));assert b'FAIL ' not in data and b'PASS retry activates15' in data
finally:
 adb('shell','rm','-f',filler,check=False)
 remaining=adb('shell','sh','-c','test ! -e '+filler+' && echo FILLER_ABSENT',check=False);(O/'filler-cleanup.txt').write_bytes(remaining);assert b'FILLER_ABSENT' in remaining
 (O/'device-disk-after.txt').write_bytes(adb('shell','df','-k','/data',check=False))
 (O/'host-disk-after.txt').write_bytes(subprocess.check_output(['df','-k','.']))
 if proc and proc.poll() is None:adb('shell','am','force-stop','eg.englishsavant.app',check=False);proc.wait(timeout=20)
 (O/'logcat.txt').write_bytes(adb('logcat','-d','-t','2500',check=False)[-1500000:]);adb('uninstall','eg.englishsavant.audit',check=False);adb('shell','pm','clear','eg.englishsavant.app',check=False);adb('reverse','--remove','tcp:18766',check=False)
 if server:server.terminate();server.wait(timeout=10)
