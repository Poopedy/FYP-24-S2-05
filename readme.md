This is the fyp project file for group FYP-24-S2-05.

Instructions:

rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i ~/fyp/pems/Singapore-fyp-ayam.pem" ~/fyp/cipherlink/FYP-24-S2-05 ubuntu@ec2-54-173-173-26.compute-1.amazonaws.com:~/cipherlink

rsync -avz /mnt/c/Users/Bryan/Documents/GitHub/FYP-24-S2-05 ~/fyp/cipherlink

CREATE DATABASE cipherlink;
CREATE USER 'fyp_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'fyp_password!';
GRANT ALL PRIVILEGES ON cipherlink.* TO 'fyp_user'@'localhost';

rsync -avz /mnt/c/Users/Bryan/Desktop/FYP Project/MySQL/fyp_database.sql ~/fyp/sql

"C:\Users\Bryan\Desktop\FYP Project\MySql\FYP_DB.sql"

ssh -i ~/fyp/pems/Singapore-fyp-ayam.pem ubuntu@ec2-54-173-173-26.compute-1.amazonaws.com

rsync -avz -e "ssh -i ~/fyp/pems/Singapore-fyp-ayam.pem" fyp_database.sql ubuntu@ec2-54-173-173-26.compute-1.amazonaws.com:/~/sql

sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

GRANT ALL PRIVILEGES ON CIPHERLINK.* TO 'root'@'%' IDENTIFIED BY 'poopedy11_';
FLUSH PRIVILEGES;

sudo systemctl restart myapp.service

sudo systemctl daemon-reload
sudo systemctl enable myapp.service
sudo systemctl start myapp.service

sudo systemctl enable react-frontend.service
sudo systemctl start react-frontend.service

sudo systemctl status node-backend.service
sudo systemctl status react-frontend.service