# Minimal devcontainer Dockerfile based on devcontainers base alpine
# Ensures a 'vscode' user exists and installs Node 18 (LTS) for a stable environment
FROM mcr.microsoft.com/devcontainers/base:alpine

# Create the vscode user and group with the same UID/GID convention used by Codespaces
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

RUN set -eux \
  && addgroup -g ${USER_GID} ${USERNAME} || true \
  && adduser -D -G ${USERNAME} -u ${USER_UID} ${USERNAME} || true

# Install Node 18 LTS and common build tools
RUN apk add --no-cache nodejs=18.20.6-r0 npm build-base python3 \
  || apk add --no-cache nodejs npm build-base python3

# Ensure workspace permissions are ok
RUN mkdir -p /workspaces && chown -R ${USERNAME}:${USERNAME} /workspaces

# Set default user
USER ${USERNAME}

WORKDIR /workspaces/windgapacademy
