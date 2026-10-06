-- -----------------------------------------------------
-- Schema microhub
-- -----------------------------------------------------
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


-- -----------------------------------------------------
-- Table `microhub`.`tipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`tipo` (
  `id` INT NOT NULL,
  `familia` VARCHAR(45) NOT NULL,
  `cpu` INT NOT NULL,
  `ram` INT NOT NULL,
  `custo_computacao` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`));


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
  `criado_em` DATETIME NOT NULL,
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



-- -----------------------------------------------------
-- Table `microhub`.`volume`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`volume` (
  `id` INT NOT NULL,
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