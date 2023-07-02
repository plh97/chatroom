resource "aws_instance" "app_server" {
  # ami           = "ami-09dac21d1664bc313"  # official one
  ami           = "ami-0ce99c18a68a1b23b"  # customized one
  instance_type = "t2.micro"
  key_name = var.key_name

  tags = {
    Name = "Chat Room"
  }
  provisioner "local-exec" {
    command = "echo ${self.private_ip} >> private_ips.txt"
  }
}
