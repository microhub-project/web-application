DROP DATABASE IF EXISTS `microhub`;
CREATE DATABASE IF NOT EXISTS `microhub`;
USE `microhub`;

-- -----------------------------------------------------
-- Table `microhub`.`componente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`componente` (
  `uuid` BINARY(16) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `nome_tecnico` VARCHAR(45) NOT NULL,
  `unidade_medida` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`uuid`));

-- -----------------------------------------------------
-- Table `microhub`.`tipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`tipo` (
  `uuid` BINARY(16) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `cpu` INT NOT NULL,
  `ram` DECIMAL(10,2) NOT NULL,
  `custo_computacao` DECIMAL(10,2) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`uuid`));
  
-- alter table tipo add column `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- alter table tipo add column `atualizado_em` DATETIME NULL DEFAULT NULL;
-- alter table tipo modify column `ram` DECIMAL(10,2) NOT NULL;

-- -----------------------------------------------------
-- Table `microhub`.`empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`empresa` (
  `uuid` BINARY(16) NOT NULL,
  `cnpj` CHAR(14) NOT NULL,
  `razao_social` VARCHAR(90) NULL DEFAULT NULL,
  `nome_fantasia` VARCHAR(60) NULL DEFAULT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE INDEX `cnpj_unique` (`cnpj` ASC) VISIBLE);

-- -----------------------------------------------------
-- Table `microhub`.`microsservico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`microsservico` (
  `uuid` BINARY(16) NOT NULL,
  `empresa_uuid` BINARY(16) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_aplicacao_empresa_uuidx` (`empresa_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_aplicacao_empresa`
    FOREIGN KEY (`empresa_uuid`)
    REFERENCES `microhub`.`empresa` (`uuid`));

-- -----------------------------------------------------
-- Table `microhub`.`instancia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`instancia` (
  `uuid` BINARY(16) NOT NULL,
  `nome` VARCHAR(45) NULL,
  `endereco_mac` CHAR(17) NOT NULL,
  `tipo_uuid` BINARY(16) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `microsservico_uuid` BINARY(16) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE INDEX `endereco_mac_unique` (`endereco_mac` ASC) VISIBLE,
  INDEX `fk_instancia_familia1_uuidx` (`tipo_uuid` ASC) VISIBLE,
  INDEX `fk_instancia_microsservico1_uuidx` (`microsservico_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_instancia_familia1`
    FOREIGN KEY (`tipo_uuid`)
    REFERENCES `microhub`.`tipo` (`uuid`),
  CONSTRAINT `fk_instancia_microsservico1`
    FOREIGN KEY (`microsservico_uuid`)
    REFERENCES `microhub`.`microsservico` (`uuid`));

-- -----------------------------------------------------
-- Table `microhub`.`instancia_tem_componente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`instancia_tem_componente` (
  `componente_uuid` BINARY(16) NOT NULL,
  `instancia_uuid` BINARY(16) NOT NULL,
  `limite_maximo` DECIMAL(10,2) NULL,
  `limite_minimo` DECIMAL(10,2) NULL,
  `monitorado` BIT(1) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`componente_uuid`, `instancia_uuid`),
  INDEX `fk_componente_has_instancia_instancia1_uuidx` (`instancia_uuid` ASC) VISIBLE,
  INDEX `fk_componente_has_instancia_componente1_uuidx` (`componente_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_componente_has_instancia_componente1`
    FOREIGN KEY (`componente_uuid`)
    REFERENCES `microhub`.`componente` (`uuid`),
  CONSTRAINT `fk_componente_has_instancia_instancia1`
    FOREIGN KEY (`instancia_uuid`)
    REFERENCES `microhub`.`instancia` (`uuid`));

-- -----------------------------------------------------
-- Table `microhub`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`usuario` (
  `uuid` BINARY(16) NOT NULL,
  `empresa_uuid` BINARY(16) NOT NULL,
  `nome` VARCHAR(120) NOT NULL,
  `cargo` TINYINT(1) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `senha` VARCHAR(60) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`uuid`, `empresa_uuid`),
  UNIQUE INDEX `email_unique` (`email` ASC) VISIBLE,
  INDEX `fk_usuario_empresa_uuidx` (`empresa_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_empresa`
    FOREIGN KEY (`empresa_uuid`)
    REFERENCES `microhub`.`empresa` (`uuid`));

-- -----------------------------------------------------
-- Table `microhub`.`alerta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`alerta` (
  `uuid` BINARY(16) NOT NULL,
  `prioridade` TINYINT NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `valor_detectado` DECIMAL(10,2) NULL DEFAULT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_hora_resolvido` DATETIME NULL DEFAULT NULL,
  `resolvido_por` BINARY(16) NULL,
  `empresa_uuid` BINARY(16) NULL,
  `instancia_tem_componente_componente_uuid` BINARY(16) NOT NULL,
  `instancia_tem_componente_instancia_uuid` BINARY(16) NOT NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_alerta_instancia_tem_componente1_uuidx` (`instancia_tem_componente_componente_uuid` ASC, `instancia_tem_componente_instancia_uuid` ASC) VISIBLE,
  INDEX `fk_alerta_usuario1_idx` (`resolvido_por` ASC, `empresa_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_alerta_instancia_tem_componente1`
    FOREIGN KEY (`instancia_tem_componente_componente_uuid` , `instancia_tem_componente_instancia_uuid`)
    REFERENCES `microhub`.`instancia_tem_componente` (`componente_uuid` , `instancia_uuid`),
  CONSTRAINT `fk_alerta_usuario1`
    FOREIGN KEY (`resolvido_por` , `empresa_uuid`)
    REFERENCES `microhub`.`usuario` (`uuid` , `empresa_uuid`));
    
-- -----------------------------------------------------
-- Table `microhub`.`codigo_ativacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`codigo_ativacao` (
  `uuid` BINARY(16) NOT NULL,
  `empresa_uuid` BINARY(16) NOT NULL,
  `codigo` CHAR(6) NOT NULL,
  `cargo` TINYINT(1) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  `deletado_em` DATETIME NULL,
  `expira_em` DATETIME NOT NULL,
  `usado_em` DATETIME NULL,
  PRIMARY KEY (`uuid`, `empresa_uuid`),
  UNIQUE INDEX `codigo_unique` (`codigo` ASC) VISIBLE,
  INDEX `fk_codigo_empresa_uuidx` (`empresa_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_codigo_empresa`
    FOREIGN KEY (`empresa_uuid`)
    REFERENCES `microhub`.`empresa` (`uuid`));

-- -----------------------------------------------------
-- Table `microhub`.`volume`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`volume` (
  `uuid` BINARY(16) NOT NULL,
  `armazenamento` DECIMAL(10,2) NOT NULL,
  `custo_giga` DECIMAL(10,2) NOT NULL,
  `instancia_uuid` BINARY(16) NOT NULL,
  `status` TINYINT(1) NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL,
  `deletado_em` DATETIME NULL,
  PRIMARY KEY (`uuid`),
  INDEX `fk_volume_instancia1_uuidx` (`instancia_uuid` ASC) VISIBLE,
  CONSTRAINT `fk_volume_instancia1`
    FOREIGN KEY (`instancia_uuid`)
    REFERENCES `microhub`.`instancia` (`uuid`));