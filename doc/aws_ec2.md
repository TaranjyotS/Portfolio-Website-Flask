# Deploy the app on AWS EC2

1. Launch an EC2 Instance
- Log in to the AWS Management Console.
- Navigate to the EC2 Dashboard by searching for `EC2` in the AWS services search bar.
- Click on `Launch Instance`.
- Choose an `Amazon Machine Image` (AMI): Select an AMI, such as the `Ubuntu Server 20.04 LTS`.
- Choose an Instance Type: For basic web applications, `t2.micro` is sufficient and free-tier eligible.
- Configure Instance: Configure settings as needed. For most purposes, the default settings are sufficient.
- Add Storage: You can stick with the default settings or adjust according to your needs.
- Add Tags: Tags are optional but useful for managing instances.
- Configure Security Group: Create a new security group with rules allowing `HTTP (port 80)`, `HTTPS (port 443)`, and `SSH (port 22)`.
- Review and Launch: Review your settings and launch the instance. You’ll need to create or select an existing key pair to access your instance via SSH.

2. Connect to Your EC2 Instance
- Download your key pair (.pem file), for example `ec2-key.pem`.
- Change permissions of the `.pem` file.

```bash
chmod 400 your-key.pem
```

- You can verify the permissions of the key file to ensure they are correctly set.

```bash
ls -l ~/your-key.pem
```

- Connect to your instance.

```bash
ssh -i "~/your-key.pem" ubuntu@your-ec2-public-dns
```

*Note*: Make sure to download your file to home directory or you can move it from downloads/the path to key to home directory by `cp /path-to-key/your-key.pem ~/your-key.pem`.

3. Transfer files to EC2

- Use SCP to Transfer Files
- Transfer your Flask application to the EC2 instance.

```bash
scp -i "~/your-key.pem" -r /path/to/your-project ubuntu@your-ec2-public-dns:/home/ubuntu/
```

- SSH into your EC2 instance.

```bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-dns
```

4. Set up your EC2 instance

- Update and Install Software
- Update packages and install Python, pip.

```bash
sudo apt update
sudo apt install python3-pip
```

- Install Gunicorn and Nginx.

```bash
sudo apt install gunicorn nginx
```

5. Configure Your Flask Application

- Navigate to your project directory.

```bash
cd /home/ubuntu/your-project
```

- Install project dependencies.

```bash
pip install -r requirements.txt
```

*Note:* If you are not using a python virtual environment, you might need install the python packages in the following way:

```bash
sudo apt install python3-<package-name>
```

6. Configure Gunicorn

- Start Gunicorn
    - w 4 specifies 4 worker processes.
    - b 0.0.0.0:8000 binds Gunicorn to all IP addresses on port 8000.
    - wsgi:app refers to the app object in wsgi.py.

```bash
gunicorn -w 4 -b 0.0.0.0:8000 wsgi:app
```

7. Configure Nginx

- Create an Nginx configuration file for your Flask app.

```bash
sudo nano /etc/nginx/sites-available/your-project
```
    
- Add the following configuration.

```bash
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    error_log /var/log/nginx/your_project_error.log;
    access_log /var/log/nginx/your_project_access.log;

    # Handle errors
    error_page 500 502 503 504 /500.html;
    location = /500.html {
        root /usr/share/nginx/html;
        internal;
    }
}
```

*Note:* To get you domain or ip address, you can use

```bash
(Invoke-RestMethod -Uri "http://ifconfig.me").Trim()
```

- Enable the Nginx configuration

```bash
sudo ln -s /etc/nginx/sites-available/your-project /etc/nginx/sites-enabled
```

- Test Nginx configuration

```bash
sudo nginx -t
```

- Restart Nginx.

```bash
sudo systemctl restart nginx
```

**Note**: Your Flask application should now be accessible via HTTP at http://your_domain_or_ip.

### Troubleshooting

- Ensure that your Flask application (e.g., running with Gunicorn) is active and listening on the port specified in the Nginx configuration. For example:

```bash
gunicorn --bind 127.0.0.1:8000 wsgi:app
```

- You can check nginx logs to see if something is not working.

```bash
sudo tail -f /var/log/nginx/error.log
```

```bash
sudo cat /var/log/nginx/error.log
sudo cat /var/log/nginx/access.log
```

- Verify DNS Configuration

```bash
nslookup your_domain.com
```

- Check Nginx Configuration

```bash
sudo systemctl status nginx
```

- Server Reachability, either by ping or telnet

```bash
ping your_ip_address
```

```bash
telnet 99.247.33.55 80
```

- Check server status.

```bash
ps aux | grep gunicorn
```

- Verify Server Listening Ports

```bash
sudo ss -tuln
```
