FROM alpine:latest

ARG PB_VERSION=0.23.1

RUN apk add --no-cache unzip ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/
RUN chmod +x /pb/pocketbase

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb_data", "--publicDir=/pb_public", "--hooksDir=/pb_hooks", "--migrationsDir=/pb_migrations", "--encryptionEnv=PB_ENCRYPTION"]