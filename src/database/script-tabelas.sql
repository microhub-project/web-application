-- https://calculator.aws/#/estimate

DROP DATABASE IF EXISTS `microhub`;
CREATE DATABASE IF NOT EXISTS `microhub`;
USE `microhub`;

-- -----------------------------------------------------
-- Table `microhub`.`componente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`componente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `unidade_medida` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`));

insert into microhub.componente (nome, unidade_medida) values 
	('cpu_percent', '%'),
    ('cpu_frequency', 'GHz'),
    ('ram_percent', '%'),
    ('swap_memory_percent', '%'),
    ('upload_traffic', 'Mpbs'),
    ('download_traffic', 'Mbps'),
    ('disk', 'GiB'),
    ('processes', 'processos'),
    ('zombie_processes', '%');

-- -----------------------------------------------------
-- Table `microhub`.`tipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`tipo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `cpu` INT NOT NULL,
  `ram` INT NOT NULL,
  `custo_computacao` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`));

insert into `microhub`.`tipo` (`nome`, `cpu`, `ram`, `custo_computacao`) values
	('t3.medium', 2, 4, 18.83),
    ('t3.xlarge', 4, 16, 75.34),
    ('m5.xlarge', 4, 16, 89.06),
    ('c5d.xlarge', 4, 8, 84.68),
    ('r5d.xlarge', 4, 32, 135.05),
    ('m5.2xlarge', 8, 32, 177.39),
    ('c5d.2xlarge', 8, 16, 169.36),
    ('r5d.2xlarge', 8, 64, 270.83),
    ('g4dn.2xlarge', 8, 32, 383.98),
    ('m5.4xlarge', 16, 64, 355.51),
    ('c5d.4xlarge', 16, 32, 338.71),
    ('r5d.4xlarge', 16, 128, 541.66),
    ('g4dn.4xlarge', 16, 64, 615.39),
    ('m5.8xlarge', 32, 128, 711.02),
    ('r5d.8xlarge', 32, 256, 1082.59),
    ('c5d.12xlarge', 48, 96, 1015.43);

-- -----------------------------------------------------
-- Table `microhub`.`empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`empresa` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cnpj` CHAR(14) NOT NULL,
  `razao_social` VARCHAR(90) NULL DEFAULT NULL,
  `nome_fantasia` VARCHAR(60) NULL DEFAULT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cnpj_unique` (`cnpj` ASC) VISIBLE);

INSERT INTO `microhub`.`empresa` (`cnpj`, `razao_social`, `nome_fantasia`, `status`) VALUES
  ('12345678000195', 'Tech Solutions Ltda', 'Tech Solutions', 1),
  ('98765432000110', 'Inovacao Digital S.A.', 'Inovacao Tech', 1);

-- -----------------------------------------------------
-- Table `microhub`.`microsservico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`microsservico` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_aplicacao_empresa_idx` (`empresa_id` ASC) VISIBLE,
  CONSTRAINT `fk_aplicacao_empresa`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `microhub`.`empresa` (`id`));

INSERT INTO `microhub`.`microsservico` (`empresa_id`, `nome`, `descricao`, `status`) VALUES
  (1, 'Autenticação', 'Serviço responsável por login e emissão de tokens JWT', 1),
  (1, 'Pagamentos', 'Processamento de transações de cartão de crédito e PIX', 1),
  (2, 'Notificações', 'Serviço para disparo de e-mails e SMS', 1);

-- -----------------------------------------------------
-- Table `microhub`.`instancia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`instancia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `endereco_mac` CHAR(17) NOT NULL,
  `tipo_id` INT NOT NULL,
  `custo_mensal` DECIMAL(10,2) NULL,
  `status` TINYINT(1) NOT NULL,
  `microsservico_id` INT NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `endereco_mac_unique` (`endereco_mac` ASC) VISIBLE,
  INDEX `fk_instancia_familia1_idx` (`tipo_id` ASC) VISIBLE,
  INDEX `fk_instancia_microsservico1_idx` (`microsservico_id` ASC) VISIBLE,
  CONSTRAINT `fk_instancia_familia1`
    FOREIGN KEY (`tipo_id`)
    REFERENCES `microhub`.`tipo` (`id`),
  CONSTRAINT `fk_instancia_microsservico1`
    FOREIGN KEY (`microsservico_id`)
    REFERENCES `microhub`.`microsservico` (`id`));

INSERT INTO `microhub`.`instancia` (`endereco_mac`, `tipo_id`, `custo_mensal`, `status`, `microsservico_id`) VALUES
  ('00:1A:2B:3C:4D:5E', 1, 33.83, 1, 1),
  ('00:1A:2B:3C:4D:5F', 2, 97.84, 1, 2),
  ('00:1A:2B:3C:4D:60', 3, 111.56, 1, 3);

-- -----------------------------------------------------
-- Table `microhub`.`instancia_tem_componente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`instancia_tem_componente` (
  `componente_id` INT NOT NULL,
  `instancia_id` INT NOT NULL,
  `limite_maximo` DECIMAL(10,2) NULL,
  `limite_minimo` DECIMAL(10,2) NULL,
  `monitorado` BIT(1) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`componente_id`, `instancia_id`),
  INDEX `fk_componente_has_instancia_instancia1_idx` (`instancia_id` ASC) VISIBLE,
  INDEX `fk_componente_has_instancia_componente1_idx` (`componente_id` ASC) VISIBLE,
  CONSTRAINT `fk_componente_has_instancia_componente1`
    FOREIGN KEY (`componente_id`)
    REFERENCES `microhub`.`componente` (`id`),
  CONSTRAINT `fk_componente_has_instancia_instancia1`
    FOREIGN KEY (`instancia_id`)
    REFERENCES `microhub`.`instancia` (`id`));

INSERT INTO `microhub`.`instancia_tem_componente` (`componente_id`, `instancia_id`, `limite_maximo`, `limite_minimo`, `monitorado`, `status`) VALUES
  (1, 1, 80.00, 10.00, 1, 1),
  (3, 1, 90.00, 15.00, 1, 1),
  (1, 2, 85.00, 5.00, 1, 1);
  
-- -----------------------------------------------------
-- Table `microhub`.`alerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`alerta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `prioridade` TINYINT NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `valor_detectado` DECIMAL(10,2) NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_hora_resolvido` DATETIME NULL,
  `instancia_tem_componente_componente_id` INT NOT NULL,
  `instancia_tem_componente_instancia_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_alerta_instancia_tem_componente1_idx` (`instancia_tem_componente_componente_id` ASC, `instancia_tem_componente_instancia_id` ASC) VISIBLE,
  CONSTRAINT `fk_alerta_instancia_tem_componente1`
    FOREIGN KEY (`instancia_tem_componente_componente_id` , `instancia_tem_componente_instancia_id`)
    REFERENCES `microhub`.`instancia_tem_componente` (`componente_id` , `instancia_id`));

INSERT INTO `microhub`.`alerta` (`prioridade`, `descricao`, `valor_detectado`, `status`, `instancia_tem_componente_componente_id`, `instancia_tem_componente_instancia_id`) VALUES
  (3, 'Uso excessivo de CPU detectado', 92.50, 1, 1, 1),
  (2, 'Consumo de RAM acima do limite', 91.20, 1, 3, 1);

-- -----------------------------------------------------
-- Table `microhub`.`codigo_ativacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`codigo_ativacao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `codigo` CHAR(6) NOT NULL,
  `cargo` TINYINT(1) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  `deletado_em` DATETIME NULL,
  `expira_em` DATETIME NOT NULL,
  `usado_em` DATETIME NULL,
  PRIMARY KEY (`id`, `empresa_id`),
  UNIQUE INDEX `codigo_unique` (`codigo` ASC) VISIBLE,
  INDEX `fk_codigo_empresa_idx` (`empresa_id` ASC) VISIBLE,
  CONSTRAINT `fk_codigo_empresa`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `microhub`.`empresa` (`id`));

INSERT INTO `microhub`.`codigo_ativacao` (`empresa_id`, `codigo`, `cargo`, `status`, `expira_em`) VALUES
  (1, 'ACT123', 1, 1, DATE_ADD(NOW(), INTERVAL 7 DAY)),
  (2, 'ACT456', 2, 1, DATE_ADD(NOW(), INTERVAL 7 DAY));

-- -----------------------------------------------------
-- Table `microhub`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `nome` VARCHAR(120) NOT NULL,
  `cargo` TINYINT(1) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `senha` BLOB NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`id`, `empresa_id`),
  UNIQUE INDEX `email_unique` (`email` ASC) VISIBLE,
  INDEX `fk_usuario_empresa_idx` (`empresa_id` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_empresa`
    FOREIGN KEY (`empresa_id`)
    REFERENCES `microhub`.`empresa` (`id`));
    
INSERT INTO `microhub`.`usuario` (`empresa_id`, `nome`, `cargo`, `email`, `senha`, `status`) VALUES
  (1, 'João Silva', 1, 'joao.silva@techsolutions.com', SHA2('senha123', 256), 1),
  (2, 'Maria Oliveira', 2, 'maria@inovacao.com', SHA2('senha123', 256), 1);

-- -----------------------------------------------------
-- Table `microhub`.`volume`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`volume` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `armazenamento` DECIMAL(10,2) NOT NULL,
  `custo_giga` DECIMAL(10,2) NOT NULL,
  `instancia_id` INT NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_volume_instancia1_idx` (`instancia_id` ASC) VISIBLE,
  CONSTRAINT `fk_volume_instancia1`
    FOREIGN KEY (`instancia_id`)
    REFERENCES `microhub`.`instancia` (`id`));
    
INSERT INTO `microhub`.`volume` (`armazenamento`, `custo_giga`, `instancia_id`, `status`) VALUES
  (100.00, 0.15, 1, 1),
  (150.00, 0.15, 2, 1),
  (200.00, 0.15, 3, 1);
  
  select * from alerta;
  select * from codigo_ativacao;
  select * from componente;
  select * from empresa;
  select * from instancia;
  select * from instancia_tem_componente;
  select * from microsservico;
  select * from tipo;
  select * from usuario;
  select * from volume;