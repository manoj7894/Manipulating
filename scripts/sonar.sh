# Install SonarQube
# Install unzip if not already installed
sudo apt-get install unzip -y

# Create a user for SonarQube
sudo adduser --disabled-password --gecos 'SonarQube' sonarqube

# Switch to SonarQube user and install SonarQube
sudo su - sonarqube <<EOF
# Fetch the latest SonarQube version from the official source
SONARQUBE_VERSION=$(curl -s https://api.github.com/repos/SonarSource/sonarqube/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')
SONARQUBE_URL="https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-${SONARQUBE_VERSION}.zip"

# Download and extract SonarQube
wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-9.4.0.54424.zip
unzip sonarqube-9.4.0.54424.zip
chmod -R 755 /home/sonarqube/sonarqube-9.4.0.54424
# Change ownership
chown -R sonarqube:sonarqube /home/sonarqube/sonarqube-9.4.0.54424
# Start SonarQube
cd sonarqube-9.4.0.54424/bin/linux-x86-64/
./sonar.sh start
EOF

echo "Sonarqube installation complete."
