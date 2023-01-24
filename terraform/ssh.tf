variable "key_name" {
  default = "qwe"
}

resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "vultr_ssh_key" "my_ssh_key" {
  name    = var.key_name
  ssh_key = tls_private_key.example.public_key_openssh
}

resource "local_file" "pem_file" {
  filename             = pathexpand("~/.ssh/${var.key_name}.pem")
  file_permission      = "600"
  directory_permission = "700"
  sensitive_content    = tls_private_key.example.private_key_pem
  # provisioner "local-exec" {
  #   command = "echo Host vultr\nHostName 149.28.148.14\nUser root\nIdentityFile ~/.ssh/qwe.pem >> ../ansible/hosts"
  # }
}

# resource "ssh_resource" "init" {
#   agent       = true
#   when        = "create"
#   host        = vultr_instance.instance.main_ip
#   user        = "root"
#   timeout     = "15m"
#   retry_delay = "5s"

#   file {
#     # content = "cat ~/.ssh/${var.key_name}.pem"
#     # destination = "~/.ssh/config"
#     content     = "echo Hello world"
#     destination = "/tmp/hello.sh"
#     permissions = "0700"
#   }
# }
