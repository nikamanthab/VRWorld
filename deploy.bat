@ECHO OFF
npm run bundle
cd build
surge --domain https://vr-theatre.surge.sh