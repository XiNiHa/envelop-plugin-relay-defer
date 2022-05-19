import { isAsyncIterable, mapAsyncIterator, type Plugin } from "@envelop/core";

interface Options {
  noHasNext: boolean;
}

const relayDeferPlugin = ({ noHasNext }: Options): Plugin => ({
  onExecute() {
    return {
      onExecuteDone({ result, setResult }) {
        if (isAsyncIterable(result)) {
          setResult(
            mapAsyncIterator(result, (chunk) => {
              const { hasNext, ...rest } = chunk;
              return {
                ...rest,
                ...(hasNext && !noHasNext ? { hasNext } : {}),
                extensions: {
                  ...rest.extensions,
                  is_final: !hasNext,
                },
              };
            })
          );
        }
      },
    };
  },
});

export default relayDeferPlugin;
