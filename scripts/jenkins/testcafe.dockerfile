FROM testcafe/testcafe

USER root
COPY ./functional ./tests

RUN mkdir -p $HOME && \
    cd ./tests/ && \
    npm i chai isomorphic-fetch uuid

CMD ["chromium --no-sandbox", "/tests"]
