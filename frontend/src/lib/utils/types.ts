import type { z } from 'zod';
import type { ModelMapEntry } from './crud';
import type { RiskScenarioSchema } from './schemas';

export interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	is_active: boolean;
	keep_local_login: boolean;
	date_joined: string;
	user_groups: Record<string, any>[];
	roles: Record<string, any>[];
	permissions: Record<string, any>[];
	is_third_party: boolean;
	is_admin: boolean;
	accessible_domains: string[];
	domain_permissions: Record<string, string[]>;
	root_folder_id: string;
	preferences: {
		lang?: string;
	};
}

export interface GlobalSettings {
	name: string;
	settings: Record<string, any>;
}

export interface LoginRequestBody {
	email: string;
	password: string;
}

export const URL_MODEL = [
	'folders',
	'perimeters',
	'risk-matrices',
	'risk-assessments',
	'threats',
	'risk-scenarios',
	'applied-controls',
	'policies',
	'risk-acceptances',
	'reference-controls',
	'assets',
	'users',
	'user-groups',
	'roles',
	'role-assignments',
	'compliance-assessments',
	'evidences',
	'frameworks',
	'requirements',
	'requirement-assessments',
	'stored-libraries',
	'loaded-libraries',
	'libraries',
	'sso-settings',
	'general-settings',
	'feature-flags',
	'requirement-mapping-sets',
	'entities',
	'entity-assessments',
	'solutions',
	'representatives',
	'vulnerabilities',
	'filtering-labels',
	// 'ebios-rm',
	'feared-events',
	'ro-to',
	'stakeholders',
	'strategic-scenarios',
	'attack-paths',
	'operational-scenarios',
	'elementary-actions',
	'operating-modes',
	'kill-chains',
	// qualifications
	'qualifications',
	'processings',
	'processing-natures',
	'security-exceptions',
	'findings',
	'findings-assessments',
	// privacy,
	'processings',
	'purposes',
	'personal-data',
	'data-subjects',
	'data-recipients',
	'data-contractors',
	'data-transfers',
	// incidents,
	'incidents',
	'timeline-entries',
	// tasks,
	'task-templates',
	'task-nodes',
	// resilience,
	'business-impact-analysis',
	'escalation-thresholds',
	'asset-assessments',
	'asset-class',
	// campaigns,
	'campaigns'
] as const;

export const THIRD_PARTY_URL_MODEL = ['compliance-assessments', 'evidences'] as const;

export type urlModel = (typeof URL_MODEL)[number];

export type thirdPartyUrlModel = (typeof THIRD_PARTY_URL_MODEL)[number];

export type ModelInfo = ModelMapEntry;

interface ProbabilityImpactItem {
	abbreviation: string;
	name: string;
	description: string;
}

interface RiskItem extends ProbabilityImpactItem {
	hexcolor: string;
}

export interface RiskMatrixJsonDefinition {
	name: string;
	description: string;
	probability: ProbabilityImpactItem[];
	impact: ProbabilityImpactItem[];
	risk: RiskItem[];
	grid: number[][];
}

export interface RiskMatrix {
	locale?: string; // optional, defaults en english.
	name: string;
	description: string;
	format_version?: string;
	json_definition: string; // stringified
}

export interface Perimeter {
	id: string;
	folder: Record<string, any>;
	lc_status: string;
	created_at: string;
	updated_at: string;
	is_published: boolean;
	name: string;
	description?: string;
	ref_id?: string;
	compliance_assessments: Record<string, any>[];
}

export type RiskScenario = z.infer<typeof RiskScenarioSchema>;

interface LibraryObject {
	type: 'risk_matrix' | 'reference_control' | 'threat';
	fields: Record<string, any>;
}

export interface Library {
	name: string;
	urn: string;
	id?: string;
	dependencies: string[];
	description: string;
	locale: 'en' | 'fr';
	format_version: string;
	objects: LibraryObject[];
	copyright: string;
	provider: string;
	packager: string;
}

export interface RiskLevel {
	current: string[];
	residual: string[];
}

export interface StrengthOfKnowledgeEntry {
	name: string;
	description: string;
	symbol: string;
}

export interface AggregatedData {
	names: string[];
}

export interface AppliedControlStatus {
	localLables: string[];
	labels: any[];
	values: any[]; // Set these types later on
}

export interface CacheLock {
	promise: Promise<any>;
	resolve: (_: any) => any;
}
