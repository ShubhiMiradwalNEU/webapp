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

<<<<<<< HEAD
variable "ami_users" {
  type    = list(string)
=======
variable "ami_users"{
  type = list(string)
>>>>>>> cc6b5ec34c3f9cac433d42574f0f80c16b12919b
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
  provisioner "file" {
    destination = "/tmp/webapp.service"
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
      // "sudo apt-get install -y postgresql postgresql-contrib",
      "npm install sequelize --save",
      "sudo npm install -g sequelize-cli",
      "npm install express --save",
      "sudo -u postgres psql -c \"ALTER USER postgres WITH PASSWORD 'shubhi2304';\"",
     "cd service",
      "sudo cp webapp.service /usr/lib/systemd/system/webapp.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp.service",
      "sudo systemctl start webapp.service",
    ]
  }
}

