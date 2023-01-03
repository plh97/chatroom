resource "vultr_instance" "instance" {
  plan              = "vc2-1c-1gb"
  region            = "sgp"
  snapshot_id       = "57beb9c5-2db3-46a2-b9ed-bfc325a4c614"
  firewall_group_id = "dd776525-5e19-42e1-b55a-ad6da1cf6a4b"
  hostname          = "vultr.guest"
  label             = "test-label"
  tags              = ["test-tag"]
  ssh_key_ids       = [var.ssh_key_id]
}
