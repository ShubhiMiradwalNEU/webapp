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
  default = ["553820382563"]
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
      "sudo apt-get install -y unzip",
      "unzip webapp.zip",
      "cd webapp",
      "sudo groupadd group",
      "sudo useradd -s /bin/false -g group -d /opt/user -m user",
      "sudo apt-get install -y nodejs npm",
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
}

