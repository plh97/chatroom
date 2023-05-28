# provider "acme" {
#   server_url = "https://acme-staging-v02.api.letsencrypt.org/directory"
#   #server_url = "https://acme-v02.api.letsencrypt.org/directory"
# }

# # data "aws_route53_zone" "base_domain" {
# #   name = "test.singh.cl" # TODO put your own DNS in here!
# # }

# resource "vultr_dns_domain" "domain" {
#   domain = "plhh.xyz"
#   ip     = vultr_instance.instance.main_ip
# }

# resource "tls_private_key" "private_key" {
#   algorithm = "RSA"
# }

# resource "acme_registration" "registration" {
#   account_key_pem = tls_private_key.private_key.private_key_pem
#   email_address   = "pengliheng111@gmail.com" # TODO put your own email in here!
# }

# resource "acme_certificate" "certificate" {
#   account_key_pem           = acme_registration.registration.account_key_pem
#   common_name               = vultr_dns_domain.domain.name
#   subject_alternative_names = ["*.${vultr_dns_domain.domain.name}"]

#   dns_challenge {
#     provider = "route53"

#     config = {
#       AWS_HOSTED_ZONE_ID = data.aws_route53_zone.base_domain.zone_id
#     }
#   }

#   depends_on = [acme_registration.registration]
# }