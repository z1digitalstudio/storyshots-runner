FROM ubuntu:20.04

LABEL org.opencontainers.image.source=https://github.com/z1digitalstudio/storyshots-runner

RUN apt-get update && \
    apt-get install -y curl gnupg2 && \
    # Add Ungoogled Chromium repos
    echo 'deb http://download.opensuse.org/repositories/home:/ungoogled_chromium/Ubuntu_Focal/ /' | tee /etc/apt/sources.list.d/home-ungoogled_chromium.list > /dev/null && \
    curl -s 'https://download.opensuse.org/repositories/home:/ungoogled_chromium/Ubuntu_Focal/Release.key' | gpg --dearmor | tee /etc/apt/trusted.gpg.d/home-ungoogled_chromium.gpg > /dev/null && \
    # Add Node.js repos
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    # Actually install required dependencies
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
        firefox \
        nodejs \
        ungoogled-chromium && \
    # Cleanup
    apt-get purge -y curl gnupg2 && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g yarn
