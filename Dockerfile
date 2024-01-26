from node:latest

# Path: /app
COPY . /app
RUN cd /app && npm install

EXPOSE 7878
WORKDIR /app
CMD ["npm", "run", "dev"]
