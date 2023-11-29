packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

variable "source_ami" {
  type    = string
  default = "ami-0b6edd8449255b799"
}

variable "aws_region" {
  type    = string
  default = "us-west-2"
}

variable "ami-prefix" {
  type    = string
  default = "webapp"
}

variable "ami_users" {
  type    = list(string)
  default = ["553820382563","240210896617"]
}


source "amazon-ebs" "my_ami" {

  ami_name      = "${var.ami-prefix}-${local.timestamp}"
  instance_type = "t2.micro"
  region        = "${var.aws_region}"
  source_ami    = "${var.source_ami}"
  ami_users     = "${var.ami_users}"

  ssh_username = "admin"
}

build {
  name    = "learn-packer"
  sources = ["source.amazon-ebs.my_ami"]

  provisioner "file" {
    destination = "/home/admin/"
    source      = "../webapp.zip"
    generated   = true
  }

  provisioner "shell" {
    
    inline = [
      "#!/bin/bash",
      "sudo apt-get update",
      "sudo apt-get install -y unzip nodejs npm",
      "unzip webapp.zip",
      "cd webapp",
      "sudo groupadd group",
      "sudo useradd -s /bin/false -g group -d /opt/user -m user",
      "sudo chmod -R 755 /home/admin/webapp",
      "rm -rf node_modules",
      "npm install",
      "npm install sequelize --save",
      "sudo npm install -g sequelize-cli",  
      "npm install express --save",
      "cd service",
      "sudo cp webapp.service /usr/lib/systemd/system/webapp.service",
      "sudo systemctl enable webapp",
      "sudo systemctl daemon-reload",
      "sudo systemctl stop webapp",
      "sudo systemctl start webapp",
    ]
  }

    provisioner "shell" {
    inline = [
        "sudo mkdir -p /home/admin/webapp/logs",
        "sudo touch /home/admin/webapp/logs/webapp.log",
        "sudo chmod 757 /home/admin/webapp/logs/webapp.log",
        "wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb",
        "wget https://amazoncloudwatch-agent-us-west-2.s3.us-west-2.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb",
        "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb",
        "rm -f ./amazon-cloudwatch-agent.deb",
        "sudo cp /home/admin/webapp/packer/amazon-cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent.json",
        "sudo cp /home/admin/webapp/packer/amazon-cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",  
        "sudo systemctl daemon-reload",
    ]
  }
}

