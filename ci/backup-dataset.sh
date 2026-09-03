#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Exporta o dataset do Sanity (documentos em NDJSON + imagens) e, quando ha
# credenciais configuradas, envia o arquivo para um armazenamento externo.
#
# Rodar restauracao com:
#   npx sanity dataset import backups/ARQUIVO.tar.gz production --replace
#
# Variaveis obrigatorias (GitLab > Settings > CI/CD > Variables):
#   SANITY_AUTH_TOKEN               token de leitura (Viewer), masked
#   NEXT_PUBLIC_SANITY_PROJECT_ID   id do projeto
#   NEXT_PUBLIC_SANITY_DATASET      normalmente "production"
#
# Variaveis opcionais — envio para fora do Sanity e do GitLab via rclone.
# Exemplo para um bucket S3/Backblaze/R2 (nenhum passo interativo):
#   BACKUP_REMOTE=destino:meu-bucket/traqto-blog
#   RCLONE_CONFIG_DESTINO_TYPE=s3
#   RCLONE_CONFIG_DESTINO_PROVIDER=Other
#   RCLONE_CONFIG_DESTINO_ACCESS_KEY_ID=...
#   RCLONE_CONFIG_DESTINO_SECRET_ACCESS_KEY=...
#   RCLONE_CONFIG_DESTINO_ENDPOINT=...
# ---------------------------------------------------------------------------
set -euo pipefail

DATASET="${NEXT_PUBLIC_SANITY_DATASET:-production}"
DATA_HOJE="$(date -u +%Y-%m-%d)"
ARQUIVO="backups/sanity-${DATASET}-${DATA_HOJE}.tar.gz"

if [ -z "${SANITY_AUTH_TOKEN:-}" ]; then
  echo "ERRO: SANITY_AUTH_TOKEN nao esta definido. Crie um token de leitura em"
  echo "      sanity.io/manage > API > Tokens e cadastre-o como variavel de CI/CD."
  exit 1
fi

mkdir -p backups

echo "==> Exportando o dataset '${DATASET}' do Sanity"
npx --yes sanity dataset export "${DATASET}" "${ARQUIVO}"

TAMANHO="$(du -h "${ARQUIVO}" | cut -f1)"
echo "==> Backup gerado: ${ARQUIVO} (${TAMANHO})"

if [ -z "${BACKUP_REMOTE:-}" ]; then
  echo "AVISO: BACKUP_REMOTE nao configurado — a unica copia deste backup e o"
  echo "       artefato deste job, que fica dentro do GitLab e expira."
  echo "       Configure um destino externo para nao depender de um so fornecedor."
  exit 0
fi

echo "==> Enviando para ${BACKUP_REMOTE}"

# ca-certificates e obrigatorio aqui: a imagem node:22-bookworm-slim remove o
# repositorio de certificados do sistema, e o rclone (escrito em Go) depende
# dele. Sem isso todo envio HTTPS falha com "certificate signed by unknown
# authority" — o npm e a CLI do Sanity nao sofrem porque o Node embute as CAs.
apt-get update -qq
apt-get install -y -qq --no-install-recommends ca-certificates rclone

rclone copy "${ARQUIVO}" "${BACKUP_REMOTE}" --stats-one-line

# Confirma no log que o arquivo chegou, em vez de confiar no codigo de saida.
echo "==> Conteudo atual do destino:"
rclone lsf "${BACKUP_REMOTE}"

echo "==> Backup enviado com sucesso"
