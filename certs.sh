ssh-keygen -t rsa -b 4096 -C "github.email@gmail.com"
# whit name $USER.github_id_rsa or default id_rsa

cat /home/$USER/certs/$USER.github_id_rsa  >> ~/.ssh/authorized_keys

#
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 4443
