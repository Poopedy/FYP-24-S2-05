This is the fyp project file for group FYP-24-S2-05.

FOR MAC:
/Users/bryan/Documents/GitHub/FYP-24-S2-05

ssh -i "SG-FYP-MAC.pem" ubuntu@ec2-54-179-174-127.ap-southeast-1.compute.amazonaws.com

rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i SG-FYP-MAC.pem" \
/Users/bryan/Documents/GitHub/FYP-24-S2-05 ubuntu@ec2-54-179-174-127.ap-southeast-1.compute.amazonaws.com:~/cipherlink

rsync -avz -e "ssh -i SG-FYP-MAC.pem"  fyp_database.sql ubuntu@ec2-54-179-174-127.ap-southeast-1.compute.amazonaws.com:~/db