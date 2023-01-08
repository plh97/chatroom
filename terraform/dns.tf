resource "vultr_dns_domain" "my_domain" {
  domain = "plhh.xyz"
  ip     = vultr_instance.instance.main_ip
}

resource "vultr_dns_record" "my_record" {
  domain = vultr_dns_domain.my_domain.id
  name   = "chat"
  data   = vultr_instance.instance.main_ip
  type   = "A"
}

resource "vultr_dns_record" "my_record" {
  domain = vultr_dns_domain.my_domain.id
  name   = "api"
  data   = vultr_instance.instance.main_ip
  type   = "A"
}
