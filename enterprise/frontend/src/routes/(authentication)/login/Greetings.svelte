<script lang="ts">
	import * as m from '$paraglide/messages.js';
	import Typewriter from 'sv-typewriter';
	import Logo from '$lib/components/Logo/Logo.svelte';
	import { page } from '$app/state';

	const clientSettings = page.data.clientSettings;
</script>

<div
	id="hellothere"
	class="flex flex-col justify-center items-center lg:w-3/5 text-gray-900 px-4 lg:px-0"
>
	{#if !clientSettings?.settings.name}
		<Typewriter mode="loopOnce" cursor={false} interval={50}>
			<div class="text-2xl unstyled text-center pb-4">
				<span class="text-2xl text-center">{m.helloThere()} </span>
				<span> {m.thisIsCisoAssistant()} </span>
			</div>
		</Typewriter>
		<Typewriter mode="cascade" cursor={false} interval={45} delay={5000}>
			<div class="text-2xl unstyled text-center">
				<span> {m.yourStreamlined()} </span>
				<span class="font-black"> {m.oneStopShop()} </span>
				<span> {m.forComplianceRiskManagement()} </span>
			</div>
		</Typewriter>
	{:else}
		<Logo width={400} height={400} />
	{/if}
</div>
