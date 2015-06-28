FROM ubuntu:14.04

MAINTAINER Rick Golden "golden@golden-garage.net"


RUN update-locale LANG=C.UTF-8 LC_MESSAGES=POSIX

RUN apt-get update
RUN apt-get -y dist-upgrade
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential
RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10
RUN npm install -g typescript@1.4.1
RUN npm install -g typescript-simple

RUN curl https://install.meteor.com/ | sh

WORKDIR /opt/application
ADD . /opt/application

EXPOSE 3000


CMD [ "meteor" ]

