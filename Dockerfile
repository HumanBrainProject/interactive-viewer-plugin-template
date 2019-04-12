FROM node:8

ARG HOSTNAME
ARG VUE_APP_BACKEND_URL
ARG BACKEND_URL
ARG PORT

ENV BACKEND_URL=$BACKEND_URL
ENV HOSTNAME=$HOSTNAME
ENV PLUGIN_NAME=fzj.xg.webjugex
ENV PLUGIN_DISPLAY_NAME=JuGEx\ differential\ gene\ expression\ analysis
ENV VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL
ENV PORT=$PORT

COPY . /webjugex-frontend
WORKDIR /webjugex-frontend
RUN npm i
RUN npm run build-ssr

EXPOSE $PORT

ENTRYPOINT [ "node", "vueSsr/deployServer.js"]