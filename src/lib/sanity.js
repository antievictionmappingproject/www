import PicoSanity from 'picosanity';

export function getClient(fetcher) {
	return new PicoSanity(
		{
			projectId: 'x8jn2l2i',
			dataset: 'production',
			apiVersion: '2021-11-28',
			useCdn: true
		},
		fetcher
	);
}
