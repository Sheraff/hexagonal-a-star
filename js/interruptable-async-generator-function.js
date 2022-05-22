export default function interruptableAsyncGeneratorFunction(generator) {
	let kill
	const iterator = generator()

	void async function () {
		while (!kill) {
			const a = await iterator.next()
			kill = kill || a.done
		}
	}()

	return () => kill = true
}