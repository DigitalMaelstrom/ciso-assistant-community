<script lang="ts">
	import type { PageData } from './$types';
	import { m } from '$paraglide/messages';
	import { page } from '$app/state';
	import { pageTitle } from '$lib/utils/stores';
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import { safeTranslate } from '$lib/utils/i18n';
	import { canPerformAction } from '$lib/utils/access-control';
	import ModelTable from '$lib/components/ModelTable/ModelTable.svelte';
	import CreateModal from '$lib/components/Modals/CreateModal.svelte';
	import {
		getModalStore,
		type ModalComponent,
		type ModalSettings,
		type ModalStore
	} from '$lib/components/Modals/stores';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	const modalStore: ModalStore = getModalStore();

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const operationalScenario = $derived(data.data);

	pageTitle.set(m.operationalScenarioRefId({ refId: operationalScenario.ref_id }));

	let activeActivity: string | null = $state(null);
	page.url.searchParams.forEach((value, key) => {
		if (key === 'activity' && value === 'one') {
			activeActivity = 'one';
		} else if (key === 'activity' && value === 'two') {
			activeActivity = 'two';
		} else if (key === 'activity' && value === 'three') {
			activeActivity = 'three';
		}
	});

	let likelihoodPopupOpen = $state(false);
	let gravityPopupOpen = $state(false);
	let riskLevelPopupOpen = $state(false);

	const user = page.data.user;
	import { URL_MODEL_MAP } from '$lib/utils/crud';
	const model = URL_MODEL_MAP['operational-scenarios'];
	const canEditObject = (operational_scenarios): boolean =>
		canPerformAction({
			user,
			action: 'change',
			model: model.name,
			domain: operational_scenarios.folder?.id
		});

	function modalCreateForm(model: Record<string, any>): void {
		let modalComponent: ModalComponent = {
			ref: CreateModal,
			props: {
				form: model.createForm,
				model: model,
				debug: false
			}
		};
		let modal: ModalSettings = {
			type: 'component',
			component: modalComponent,
			// Data
			title: safeTranslate('add-' + model.info.localName)
		};
		modalStore.trigger(modal);
	}

	let group = $state(Object.keys(data.relatedModels)[0]);
</script>

<div class="card p-4 bg-white shadow-lg">
	<div class="flex flex-col space-y-4 items-center">
		<div class="flex items-center justify-between w-full">
			<a
				href="/ebios-rm/{operationalScenario.ebios_rm_study.id}"
				class="flex items-center space-x-2 text-primary-800 hover:text-primary-600"
			>
				<i class="fa-solid fa-arrow-left"></i>
				<p class="">{m.goBackToEbiosRmStudy()}</p>
			</a>
			<div class="flex font-bold text-2xl space-x-2">
				<span
					><a
						class="text-primary-700 hover:text-primary-500"
						href="/ebios-rm/{operationalScenario.ebios_rm_study.id}"
						>{operationalScenario.ebios_rm_study.str}</a
					>
					- {m.operationalScenarioRefId({ refId: operationalScenario.ref_id })}</span
				>
				<p class="flex items-center">
					{#if operationalScenario.is_selected}
						<span class="badge bg-green-200 text-green-700">{m.selected()}</span>
					{:else}
						<span class="badge bg-red-200 text-red-700">{m.notSelected()}</span>
					{/if}
				</p>
			</div>
			{#if canEditObject(operationalScenario)}
				<a
					href={`${page.url.pathname}/edit?activity=${activeActivity}&next=${page.url.pathname}?activity=${activeActivity}`}
					class="btn preset-filled-primary-500 h-fit justify-self-end"
				>
					<i class="fa-solid fa-pen-to-square mr-2" data-testid="edit-button"></i>
					{m.edit()}
				</a>
			{/if}
		</div>
		<div
			id="activityOne"
			class="relative p-4 space-y-4 rounded-md w-full flex flex-col items-center justify-center
                {activeActivity === 'one'
				? 'border-2 border-primary-500'
				: 'border-2 border-gray-300 border-dashed'}"
		>
			<span
				class="absolute -top-3 bg-white font-bold {activeActivity === 'one'
					? 'text-primary-500'
					: 'text-gray-500'}">{m.activityOne()}</span
			>
			<h1
				class="font-bold text-xl {activeActivity === 'one' ? 'text-primary-500' : 'text-gray-500'}"
			>
				{m.ebiosWs4_1()}
			</h1>
			{#if operationalScenario.operating_modes_description}
				<p class="text-gray-600">{operationalScenario.operating_modes_description}</p>
			{:else}
				<p class="text-gray-600">{m.noDescription()}</p>
			{/if}
			<div class="flex flex-col space-y-2 items-center">
				<div class="flex flex-col items-center space-x-2">
					<span class="font-semibold text-lg text-gray-700"
						><i class="fa-solid fa-shuffle"></i> {m.attackPath()}</span
					>
					<p class="text-gray-600">{operationalScenario.attack_path.name}</p>
					{#if operationalScenario.attack_path.description}
						<p class="text-gray-600">{operationalScenario.attack_path.description}</p>
					{/if}
				</div>
				<div class="grid grid-cols-3 gap-12 items-center">
					<div
						class="flex flex-col space-y-4 p-4 bg-red-200 border-red-400 border rounded-md shadow-xs text-center"
					>
						<h4 class="font-semibold text-gray-600">{m.riskOrigin()}</h4>
						<i class="fa-solid fa-skull-crossbones text-3xl"></i>
						<p class="badge text-white bg-red-500 capitalize">
							{safeTranslate(operationalScenario.ro_to.risk_origin)}
						</p>
					</div>
					<div
						class="flex flex-col space-y-4 p-4 bg-violet-200 border-violet-400 border rounded-md shadow-xs text-center"
					>
						<h4 class="font-semibold text-gray-600">{m.stakeholders()}</h4>
						<i class="fa-solid fa-globe text-3xl"></i>
						{#each operationalScenario.stakeholders as stakeholder}
							<p class="badge text-white bg-violet-500">
								<a class="anchor text-white" href="/stakeholders/{stakeholder.id}"
									>{stakeholder.str}</a
								>
							</p>
						{:else}
							<p class="text-gray-500 italic">{m.noStakeholders()}</p>
						{/each}
					</div>
					<div
						class="flex flex-col space-y-4 p-4 bg-blue-200 border-blue-400 border rounded-md shadow-xs text-center"
					>
						<h4 class="font-semibold text-gray-600">{m.targetObjective()}</h4>
						<i class="fa-solid fa-bullseye text-3xl"></i>
						<p class="badge text-white bg-blue-500">{operationalScenario.ro_to.target_objective}</p>
					</div>
				</div>
			</div>
			<div class="w-full p-4 bg-gray-50 border rounded-md shadow-xs">
				<h3 class="font-semibold text-lg text-gray-700 flex items-center space-x-2">
					<i class="fa-solid fa-biohazard text-red-500"></i>
					<span>{m.threats()}</span>
				</h3>
				<ul class="list-disc list-inside text-gray-600">
					{#if operationalScenario.threats?.length}
						{#each operationalScenario.threats as threat}
							<li><a class="anchor" href="/threats/{threat.id}">{threat.str}</a></li>
						{/each}
					{:else}
						<li>{m.noThreat()}</li>
					{/if}
				</ul>
			</div>
			{#if Object.keys(data.relatedModels).length > 0}
				<div class="card shadow-lg mt-8 bg-white w-full">
					<Tabs
						value={group}
						onValueChange={(e) => {
							group = e.value;
						}}
						listJustify="justify-center"
					>
						{#snippet list()}
							{#each Object.entries(data.relatedModels) as [urlmodel, model]}
								<Tabs.Control value={urlmodel}>
									{safeTranslate(model.info.localNamePlural)}
									{#if model.table.body.length > 0}
										<span class="badge preset-tonal-secondary">{model.table.body.length}</span>
									{/if}
								</Tabs.Control>
							{/each}
						{/snippet}
						{#snippet content()}
							{#each Object.entries(data.relatedModels) as [urlmodel, model]}
								<Tabs.Panel value={urlmodel}>
									<div class="flex flex-row justify-between px-4 py-2">
										<h4 class="font-semibold lowercase capitalize-first my-auto">
											{safeTranslate('associated-' + model.info.localNamePlural)}
										</h4>
									</div>
									{#if model.table}
										<ModelTable
											source={model.table}
											deleteForm={model.deleteForm}
											URLModel={urlmodel}
											baseEndpoint="/operating-modes?operational_scenario={page.params.id}"
										>
											{#snippet addButton()}
												<div>
													<span
														class="inline-flex overflow-hidden rounded-md border bg-white shadow-xs"
													>
														<button
															class="inline-block border-e p-3 btn-mini-primary w-12 focus:relative"
															data-testid="add-button"
															title={safeTranslate('add-' + model.info.localName)}
															onclick={(_) => modalCreateForm(model)}
															><i class="fa-solid fa-file-circle-plus"></i>
														</button>
													</span>
												</div>
											{/snippet}
										</ModelTable>
									{/if}
								</Tabs.Panel>
							{/each}
						{/snippet}
					</Tabs>
				</div>
			{/if}
		</div>
		<div
			id="activityTwo"
			class="relative p-4 space-y-4 rounded-md w-full flex flex-col items-center
                {activeActivity === 'two'
				? 'border-2 border-primary-500'
				: 'border-2 border-gray-300 border-dashed'}"
		>
			<span
				class="absolute -top-3 bg-white font-bold {activeActivity === 'two'
					? 'text-primary-500'
					: 'text-gray-500'}">{m.activityTwo()}</span
			>
			<h1
				class="font-bold text-xl {activeActivity === 'two' ? 'text-primary-500' : 'text-gray-500'}"
			>
				{m.ebiosWs4_2()}
			</h1>
			<div
				class="flex items-center w-full p-4 bg-gray-50 border rounded-md shadow-xs space-x-4 justify-between"
			>
				<div
					style="background-color: {operationalScenario.likelihood.hexcolor}"
					class="flex flex-col items-center justify-center border rounded-md p-4 font-semibold w-full"
				>
					<Popover
						open={likelihoodPopupOpen}
						onOpenChange={(e) => (likelihoodPopupOpen = e.open)}
						positioning={{ placement: 'bottom' }}
						zIndex="100"
						contentBase="max-w-sm"
					>
						{#snippet trigger()}
							<h3 class="font-semibold text-lg text-gray-700 flex items-center space-x-2">
								<i class="fa-solid fa-dice text-black opacity-75"></i>
								<span>{m.likelihood()}</span>
							</h3>
							<span>{operationalScenario.likelihood.name}</span>
							<i class="fa-solid fa-circle-info cursor-pointer hover:opacity-70"></i>
						{/snippet}
						{#snippet content()}
							<div
								class="card bg-black text-gray-200 p-4 z-20"
								style="color: {operationalScenario.likelihood.hexcolor}"
							>
								<p data-testid="likelihood-description" class="font-semibold">
									{operationalScenario.likelihood.description}
								</p>
								<div class="arrow bg-black"></div>
							</div>
						{/snippet}
					</Popover>
				</div>
				<i class="fa-solid fa-xmark"></i>
				<div
					style="background-color: {operationalScenario.gravity.hexcolor}"
					class="flex flex-col items-center justify-center border rounded-md p-4 font-semibold w-full"
				>
					<Popover
						open={gravityPopupOpen}
						onOpenChange={(e) => (gravityPopupOpen = e.open)}
						positioning={{ placement: 'bottom' }}
						zIndex="100"
						contentBase="max-w-sm"
					>
						{#snippet trigger()}
							<h3 class="font-semibold text-lg text-gray-700 flex items-center space-x-2">
								<i class="fa-solid fa-bomb text-black opacity-75"></i>
								<span>{m.gravity()}</span>
							</h3>
							<span>{operationalScenario.gravity.name}</span>
							<i class="fa-solid fa-circle-info cursor-pointer hover:opacity-70"></i>
						{/snippet}
						{#snippet content()}
							<div
								class="card bg-black text-gray-200 p-4 z-20"
								style="color: {operationalScenario.gravity.hexcolor}"
							>
								<p data-testid="gravity-description" class="font-semibold">
									{operationalScenario.gravity.description}
								</p>
								<div class="arrow bg-black"></div>
							</div>
						{/snippet}
					</Popover>
				</div>
				<i class="fa-solid fa-equals"></i>
				<div
					style="background-color: {operationalScenario.risk_level.hexcolor}"
					class="flex flex-col items-center justify-center border rounded-md p-4 font-semibold w-full"
				>
					<Popover
						open={riskLevelPopupOpen}
						onOpenChange={(e) => (riskLevelPopupOpen = e.open)}
						positioning={{ placement: 'bottom' }}
						zIndex="100"
						contentBase="max-w-sm"
					>
						{#snippet trigger()}
							<h3 class="font-semibold text-lg text-gray-700 flex items-center space-x-2">
								<i class="fa-solid fa-circle-radiation text-black opacity-75"></i>
								<span>{m.riskLevel()}</span>
							</h3>
							<span>{operationalScenario.risk_level.name}</span>
							<i class="fa-solid fa-circle-info cursor-pointer hover:opacity-70"></i>
						{/snippet}
						{#snippet content()}
							<div
								class="card bg-black text-gray-200 p-4 z-20"
								style="color: {operationalScenario.risk_level.hexcolor}"
							>
								<p data-testid="riskLevel-description" class="font-semibold">
									{operationalScenario.risk_level.description}
								</p>
								<div class="arrow bg-black"></div>
							</div>
						{/snippet}
					</Popover>
				</div>
			</div>
			<div class="w-full p-4 bg-gray-50 border rounded-md shadow-xs">
				<h3 class="font-semibold text-lg text-gray-700 flex items-center space-x-2">
					<i class="fa-solid fa-eye text-gray-500 opacity-75"></i>
					<span>{m.justification()}</span>
				</h3>
				{#if operationalScenario.justification}
					<p class="text-gray-600">{operationalScenario.justification}</p>
				{:else}
					<p class="text-gray-600">{m.noJustification()}</p>
				{/if}
			</div>
		</div>
	</div>
</div>
