FROM testcafe/testcafe

USER root
COPY ./functional ./tests

RUN mkdir -p $HOME && \
    cd ./tests/

CMD ["chromium --no-sandbox", "/tests"]
