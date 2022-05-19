import { isAsyncIterable, mapAsyncIterator, type Plugin } from "@envelop/core";

interface Options {
  keepHasNext: boolean;
}

const relayDeferPlugin = (options?: Partial<Options>): Plugin => {
  const merged = Object.assign({ keepHasNext: true }, options);
  return {
    onExecute() {
      return {
        onExecuteDone({ result, setResult }) {
          if (isAsyncIterable(result)) {
            setResult(
              mapAsyncIterator(result, (chunk) => {
                const { hasNext, ...rest } = chunk;
                return {
                  ...rest,
                  ...(hasNext && merged.keepHasNext ? { hasNext } : {}),
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
  };
};

export default relayDeferPlugin;
