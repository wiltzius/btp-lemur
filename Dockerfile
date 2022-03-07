FROM node:16 as frontend_builder

# to get `yarn`
RUN corepack enable

ADD . /lemur
WORKDIR /lemur

# install node deps & build frontend
RUN yarn
RUN ./node_modules/webpack-cli/bin/cli.js

FROM python:3.8

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential python-dev

# Node deps
#RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
#RUN apt-get install -y nodejs
#RUN corepack enable

# Add application code
ADD lemur /lemur/lemur
ADD assets /lemur/assets
# add built frontend code from previous stage
COPY --from=frontend_builder /lemur/assets/bundles /lemur/assets/bundles
WORKDIR /lemur
ADD requirements.txt .
ADD uwsgi.ini .

# install python deps
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# collect static files for django (including client asset bundle)
WORKDIR /lemur/lemur
RUN ./manage.py collectstatic

CMD gunicorn -b :$PORT mysite.wsgi
