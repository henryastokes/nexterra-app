export interface NXTTokenConfig {
  stableExchangeRate: number;
  governanceCreditsPerToken: number;
  accessUnitsPerToken: number;
}

export interface GovernanceCredits {
  amount: number;
  displayValue: string;
  votingPower: number;
}

export interface AccessUnits {
  amount: number;
  displayValue: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
}

export interface FiatConversion {
  fiatAmount: number;
  fiatCurrency: string;
  displayValue: string;
  tokenAmount: number;
}

const NXT_CONFIG: NXTTokenConfig = {
  stableExchangeRate: 1.00,
  governanceCreditsPerToken: 100,
  accessUnitsPerToken: 10,
};

const TIER_THRESHOLDS = {
  basic: 0,
  standard: 500,
  premium: 2000,
  enterprise: 10000,
};

export const nxtTokenService = {
  convertFiatToTokens(fiatAmount: number, currency: string = 'USD'): FiatConversion {
    const tokenAmount = fiatAmount / NXT_CONFIG.stableExchangeRate;
    return {
      fiatAmount,
      fiatCurrency: currency,
      displayValue: `$${fiatAmount.toLocaleString()}`,
      tokenAmount,
    };
  },

  convertTokensToFiat(tokenAmount: number, currency: string = 'USD'): FiatConversion {
    const fiatAmount = tokenAmount * NXT_CONFIG.stableExchangeRate;
    return {
      fiatAmount,
      fiatCurrency: currency,
      displayValue: `$${fiatAmount.toLocaleString()}`,
      tokenAmount,
    };
  },

  calculateGovernanceCredits(tokenAmount: number): GovernanceCredits {
    const credits = tokenAmount * NXT_CONFIG.governanceCreditsPerToken;
    const votingPower = Math.sqrt(credits);
    return {
      amount: Math.round(credits),
      displayValue: credits >= 1000 ? `${(credits / 1000).toFixed(1)}K` : credits.toFixed(0),
      votingPower: Math.round(votingPower * 100) / 100,
    };
  },

  calculateAccessUnits(tokenAmount: number): AccessUnits {
    const units = tokenAmount * NXT_CONFIG.accessUnitsPerToken;
    let tier: AccessUnits['tier'] = 'basic';
    
    if (units >= TIER_THRESHOLDS.enterprise) {
      tier = 'enterprise';
    } else if (units >= TIER_THRESHOLDS.premium) {
      tier = 'premium';
    } else if (units >= TIER_THRESHOLDS.standard) {
      tier = 'standard';
    }

    return {
      amount: Math.round(units),
      displayValue: units >= 1000 ? `${(units / 1000).toFixed(1)}K` : units.toFixed(0),
      tier,
    };
  },

  getGovernanceCreditsFromFiat(fiatAmount: number): GovernanceCredits {
    const conversion = this.convertFiatToTokens(fiatAmount);
    return this.calculateGovernanceCredits(conversion.tokenAmount);
  },

  getAccessUnitsFromFiat(fiatAmount: number): AccessUnits {
    const conversion = this.convertFiatToTokens(fiatAmount);
    return this.calculateAccessUnits(conversion.tokenAmount);
  },

  formatFiatOnly(amount: number, currency: string = 'USD'): string {
    if (currency === 'USD' || currency === 'USDC') {
      return `$${amount.toLocaleString()}`;
    }
    return `${amount.toLocaleString()} ${currency}`;
  },

  formatGovernanceCredits(credits: number): string {
    if (credits >= 1000000) {
      return `${(credits / 1000000).toFixed(1)}M`;
    }
    if (credits >= 1000) {
      return `${(credits / 1000).toFixed(1)}K`;
    }
    return credits.toLocaleString();
  },

  formatAccessUnits(units: number): string {
    if (units >= 1000) {
      return `${(units / 1000).toFixed(1)}K`;
    }
    return units.toLocaleString();
  },

  getTierLabel(tier: AccessUnits['tier']): string {
    const labels = {
      basic: 'Basic Access',
      standard: 'Standard Access',
      premium: 'Premium Access',
      enterprise: 'Enterprise Access',
    };
    return labels[tier];
  },

  getNXTExplainer() {
    return {
      title: 'About Governance Credits',
      description: 'Governance Credits enable participation in platform governance, access to exclusive features, and coordination within DAOs.',
      keyPoints: [
        'Not equity or an investment',
        'Enables governance participation',
        'Provides platform access',
        'Facilitates coordination',
      ],
      disclaimer: 'NexTerra Credits are utility tokens that enable governance, access, and coordination on the platform. They do not represent equity, ownership, or any form of investment in NexTerra or any DAO.',
    };
  },
};

export const formatCurrency = (amount: number, showDecimals: boolean = false): string => {
  if (showDecimals) {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${amount.toLocaleString()}`;
};

export const silentTokenConversion = (fiatAmount: number): { fiat: string; processed: boolean } => {
  console.log('[NXT] Silent conversion processed for amount:', fiatAmount);
  return {
    fiat: formatCurrency(fiatAmount),
    processed: true,
  };
};

export default nxtTokenService;
