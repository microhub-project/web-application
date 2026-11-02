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

INSERT INTO `microhub`.`componente` (`uuid`, `nome`, `nome_tecnico`, `unidade_medida`) VALUES 
    (UUID_TO_BIN('f40975fe-1a28-4526-aba0-7b15dd6048f9'), 'Porcentagem de uso de CPU', 'cpu_percent', '%'),
    (UUID_TO_BIN('84592640-3fa9-4f77-adc6-6f9e878a5f40'), 'Frequência da CPU', 'cpu_frequency', 'GHz'),
    (UUID_TO_BIN('196d04b2-a976-4da5-a2e8-2cccb42cb0ac'), 'Porcentagem de uso de memória RAM', 'ram_percent', '%'),
    (UUID_TO_BIN('6379189d-aec3-47dc-8efa-9daadd23d36d'), 'Porcentagem de uso de memória SWAP', 'swap_memory_percent', '%'),
    (UUID_TO_BIN('83589fb2-dfee-484a-bc53-4ed0c5b1777d'), 'Tráfego de bytes de upload', 'upload_traffic', 'Mpbs'),
    (UUID_TO_BIN('40a9de89-d427-4c6d-a7d2-1e4f4889b661'), 'Tráfego de bytes de download', 'download_traffic', 'Mbps'),
    (UUID_TO_BIN('5acf74f9-7e8f-46a2-853a-56fa6c6ec1e2'), 'Espaço livre no disco', 'disk', 'GiB'),
    (UUID_TO_BIN('3eef27b6-b3e3-46b3-9a2a-df7c1ce09037'), 'Quantidade de processos', 'processes_qtd', 'processos'),
    (UUID_TO_BIN('f80ca86d-d17e-4b8c-aa52-b2261b0fe643'), 'Porcentagem de processos zumbi', 'zombie_processes_percent', '%');

-- -----------------------------------------------------
-- Table `microhub`.`tipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `microhub`.`tipo` (
  `uuid` BINARY(16) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `cpu` INT NOT NULL,
  `ram` INT NOT NULL,
  `custo_computacao` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`uuid`));

INSERT INTO `microhub`.`tipo` (`uuid`, `nome`, `cpu`, `ram`, `custo_computacao`) VALUES
    (UUID_TO_BIN('ef9f4280-b9af-402b-bcaa-dcbc45462ab0'), 't3.medium', 2, 4, 18.83),
    (UUID_TO_BIN('6994f496-a302-4780-b759-f70f194d588c'), 't3.xlarge', 4, 16, 75.34),
    (UUID_TO_BIN('0a65e2db-0418-4bda-871b-5ef348d52dc7'), 'm5.xlarge', 4, 16, 89.06),
    (UUID_TO_BIN('dcdd90c0-6fde-4ab3-86cb-fc1882c6c67a'), 'c5d.xlarge', 4, 8, 84.68),
    (UUID_TO_BIN('912299df-0bed-4b3f-b12c-271e77d41610'), 'r5d.xlarge', 4, 32, 135.05),
    (UUID_TO_BIN('0456905d-f252-4afa-a39b-33a6bbeca0b8'), 'm5.2xlarge', 8, 32, 177.39),
    (UUID_TO_BIN('b62f103c-9d1b-42e0-b6e9-baa083dcac1a'), 'c5d.2xlarge', 8, 16, 169.36),
    (UUID_TO_BIN('a97fd128-ec87-454c-b508-8b5a65846be0'), 'r5d.2xlarge', 8, 64, 270.83),
    (UUID_TO_BIN('76494cf5-9591-4a9e-8d62-01059611e7e3'), 'g4dn.2xlarge', 8, 32, 383.98),
    (UUID_TO_BIN('20053509-3c2f-4d15-8209-b72b7f297994'), 'm5.4xlarge', 16, 64, 355.51),
    (UUID_TO_BIN('5003a92f-295f-4ae4-a4c9-95d9a0d27f4d'), 'c5d.4xlarge', 16, 32, 338.71),
    (UUID_TO_BIN('3a67719b-895d-4d9f-8d55-23f7a38ad7a1'), 'r5d.4xlarge', 16, 128, 541.66),
    (UUID_TO_BIN('a4ea6f4f-a9dd-4492-8c17-622764abab90'), 'g4dn.4xlarge', 16, 64, 615.39),
    (UUID_TO_BIN('c08a4736-c6a9-4cec-96f3-381b6f49621e'), 'm5.8xlarge', 32, 128, 711.02),
    (UUID_TO_BIN('3fb4a2d5-d91f-4de5-bdc6-2c6a2d248b1d'), 'r5d.8xlarge', 32, 256, 1082.59),
    (UUID_TO_BIN('5de94734-b4df-42c4-b382-c439f4273ce9'), 'c5d.12xlarge', 48, 96, 1015.43);

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

INSERT INTO `microhub`.`empresa` (`uuid`, `cnpj`, `razao_social`, `nome_fantasia`, `status`) VALUES
  (UUID_TO_BIN('61983115-a071-4cec-8bb7-d5e45e126c66'), '12345678000195', 'MicroHub Digital Solutions', 'MicroHub', 1);

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

INSERT INTO `microhub`.`microsservico` (`uuid`, `empresa_uuid`, `nome`, `descricao`, `status`) VALUES
  (UUID_TO_BIN('9f23000f-8c6b-43bd-9d91-566b8c2a34f9'), UUID_TO_BIN('61983115-a071-4cec-8bb7-d5e45e126c66'), 'Autenticação', 'Serviço responsável por login e emissão de tokens JWT', 1),
  (UUID_TO_BIN('b762054b-d0eb-44dc-b2ce-61b62776accd'), UUID_TO_BIN('61983115-a071-4cec-8bb7-d5e45e126c66'), 'Pagamentos', 'Processamento de transações de cartão de crédito e PIX', 1),
  (UUID_TO_BIN('c497fcfe-c4a4-45f3-a3d7-5e36e1a8d5fe'), UUID_TO_BIN('61983115-a071-4cec-8bb7-d5e45e126c66'), 'Notificações', 'Serviço para disparo de e-mails e SMS', 1);

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

INSERT INTO `microhub`.`instancia` (`uuid`, `nome`, `endereco_mac`, `tipo_uuid`, `status`, `microsservico_uuid`) VALUES
  (UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), NULL, '00:1A:2B:3C:4D:5E', UUID_TO_BIN('ef9f4280-b9af-402b-bcaa-dcbc45462ab0'), 1, UUID_TO_BIN('9f23000f-8c6b-43bd-9d91-566b8c2a34f9')),
  (UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), 'vm-prd-ubuntu-pagamentos', '00:1A:2B:3C:4D:5F', UUID_TO_BIN('6994f496-a302-4780-b759-f70f194d588c'), 1, UUID_TO_BIN('b762054b-d0eb-44dc-b2ce-61b62776accd')),
  (UUID_TO_BIN('47b46b2a-8ee0-4492-85d0-8095bbdab387'), 'vm-prd-ubuntu-notificacoes', '00:1A:2B:3C:4D:60', UUID_TO_BIN('0a65e2db-0418-4bda-871b-5ef348d52dc7'), 1, UUID_TO_BIN('c497fcfe-c4a4-45f3-a3d7-5e36e1a8d5fe'));

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

INSERT INTO `microhub`.`instancia_tem_componente` (`componente_uuid`, `instancia_uuid`, `limite_maximo`, `limite_minimo`, `monitorado`, `status`) VALUES
  (UUID_TO_BIN('f40975fe-1a28-4526-aba0-7b15dd6048f9'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), 80.00, 10.00, 1, 1),
  (UUID_TO_BIN('84592640-3fa9-4f77-adc6-6f9e878a5f40'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('196d04b2-a976-4da5-a2e8-2cccb42cb0ac'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), 90.00, 15.00, 1, 1),
  (UUID_TO_BIN('6379189d-aec3-47dc-8efa-9daadd23d36d'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('83589fb2-dfee-484a-bc53-4ed0c5b1777d'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('40a9de89-d427-4c6d-a7d2-1e4f4889b661'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('5acf74f9-7e8f-46a2-853a-56fa6c6ec1e2'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('3eef27b6-b3e3-46b3-9a2a-df7c1ce09037'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('f80ca86d-d17e-4b8c-aa52-b2261b0fe643'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), NULL, NULL, 0, 1),

  (UUID_TO_BIN('f40975fe-1a28-4526-aba0-7b15dd6048f9'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), 85.00, 5.00, 1, 1),
  (UUID_TO_BIN('84592640-3fa9-4f77-adc6-6f9e878a5f40'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('196d04b2-a976-4da5-a2e8-2cccb42cb0ac'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('6379189d-aec3-47dc-8efa-9daadd23d36d'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('83589fb2-dfee-484a-bc53-4ed0c5b1777d'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('40a9de89-d427-4c6d-a7d2-1e4f4889b661'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('5acf74f9-7e8f-46a2-853a-56fa6c6ec1e2'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('3eef27b6-b3e3-46b3-9a2a-df7c1ce09037'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), NULL, NULL, 0, 1),
  (UUID_TO_BIN('f80ca86d-d17e-4b8c-aa52-b2261b0fe643'), UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), NULL, NULL, 0, 1);
  
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

INSERT INTO `microhub`.`alerta` (`uuid`, `prioridade`, `descricao`, `valor_detectado`, `status`, `instancia_tem_componente_componente_uuid`, `instancia_tem_componente_instancia_uuid`) VALUES
  (UUID_TO_BIN('dd03a4c8-f6d4-4f82-b0c3-2e126633f4ce'), 3, 'Uso excessivo de CPU detectado', 92.50, 1, UUID_TO_BIN('f40975fe-1a28-4526-aba0-7b15dd6048f9'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177')),
  (UUID_TO_BIN('1e6729fd-2c17-4ac8-8e8d-b0a83ccdbd1c'), 2, 'Consumo de RAM acima do limite', 91.20, 1, UUID_TO_BIN('196d04b2-a976-4da5-a2e8-2cccb42cb0ac'), UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'));
    
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

INSERT INTO `microhub`.`codigo_ativacao` (`uuid`, `empresa_uuid`, `codigo`, `cargo`, `status`, `expira_em`) VALUES
  (UUID_TO_BIN('32cd2ab8-940c-452b-bc02-a439bfe01eaa'), UUID_TO_BIN('61983115-a071-4cec-8bb7-d5e45e126c66'), 'ACT123', 1, 1, DATE_ADD(NOW(), INTERVAL 15 MINUTE));

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
    
INSERT INTO `microhub`.`volume` (`uuid`, `armazenamento`, `custo_giga`, `instancia_uuid`, `status`) VALUES
  (UUID_TO_BIN('54d8a870-e6bd-4aaa-973b-087ed62fea45'), 100.00, 0.15, UUID_TO_BIN('0361802d-91ce-4190-8664-30ab1e1c9177'), 1),
  (UUID_TO_BIN('b81416d4-0eaa-443b-9f36-5c968fb2b29e'), 150.00, 0.15, UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), 1),
  (UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), 150.00, 0.15, UUID_TO_BIN('f0520ab4-aa09-4417-9c3b-7337f3cb20de'), 1);