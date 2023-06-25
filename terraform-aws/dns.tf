resource "aws_route53_zone" "main" {
  name = var.domain_name
}

resource "aws_eip" "lb" {
  instance = aws_instance.app_server.id
  domain   = "vpc"
}

resource "aws_route53_record" "chat" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  # records = [aws_instance.app_server.public_dns]
  records = [aws_eip.lb.public_ip]
  ttl  = 600
  type = "A"
}

# resource "aws_route53_record" "ns" {
#   allow_overwrite = true
#   name            = var.domain_name
#   ttl             = 172800
#   type            = "NS"
#   zone_id         = aws_route53_zone.main.zone_id

#   records = aws_route53_zone.main.name_servers
# }
