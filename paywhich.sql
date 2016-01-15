# Dump of table paywhich
# ------------------------------------------------------------

CREATE TABLE `paywhich` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `int_org` varchar(10) DEFAULT NULL,
  `settle_date` varchar(20) DEFAULT NULL,
  `base_currency` varchar(6) DEFAULT NULL,
  `TWD` float unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
