cwd=$(pwd)

# Get the euid-obtained home directory
EUID_HOME=$(su -c 'echo $HOME' root)

# Set $HOME to the euid-obtained home directory
export HOME=$EUID_HOME

# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain nightly

# Source the Rust environment
source $HOME/.cargo/env


cd ./native/recommendation
npm i
cd $cwd


yum install perl-IPC-Cmd perl-Test-Simple

openssl version
cd /usr/src
curl -O https://www.openssl.org/source/openssl-3.0.0.tar.gz
tar -zxf openssl-3.0.0.tar.gz
rm openssl-3.0.0.tar.gz
cd /usr/src/openssl-3.0.0

./config
make
make -j$(nproc) build_tests=no install_sw
ln -s /usr/local/lib64/libssl.so.3 /usr/lib64/libssl.so.3
ln -s /usr/local/lib64/libcrypto.so.3 /usr/lib64/libcrypto.so.3
openssl version
cd $cwd