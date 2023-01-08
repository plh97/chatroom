resource "vultr_dns_domain" "my_domain" {
  domain = "plhh.xyz"
  ip     = vultr_instance.instance.main_ip
}

resource "vultr_dns_record" "chat_record" {
  domain = vultr_dns_domain.my_domain.id
  name   = "chat"
  data   = vultr_instance.instance.main_ip
  ttl = 600
  type   = "A"
}

resource "vultr_dns_record" "api_record" {
  domain = vultr_dns_domain.my_domain.id
  name   = "api"
  ttl = 600
  data   = vultr_instance.instance.main_ip
  type   = "A"
}
