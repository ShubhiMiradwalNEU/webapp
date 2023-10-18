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

source "amazon-ebs" "my_ami" {

  ami_name      = "${var.ami-prefix}-${local.timestamp}"
  instance_type = "t2.micro"
  region        = "${var.aws_region}"
  source_ami    = "${var.source_ami}"
  ami_users     = ["553820382563"]

  ssh_username = "admin"
}

build {
  name    = "learn-packer"
  sources = ["source.amazon-ebs.my_ami"]

  provisioner "file" {
    destination = "/home/admin/"
    source      = "../webapp.zip"
  }

provisioner "shell" {

  script = "script.sh"

}

}

