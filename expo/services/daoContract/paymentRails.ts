import {
  PaymentMethod,
  PaymentDetails,
  PaymentFees,
  MobileMoneyProvider,
  MobileMoneyConfig,
  BankTransferConfig,
  Jurisdiction,
} from './types';

const MOBILE_MONEY_CONFIGS: MobileMoneyConfig[] = [
  {
    provider: 'mpesa',
    apiEndpoint: 'https://api.safaricom.co.ke/mpesa',
    supportedCountries: ['kenya', 'tanzania'],
    supportedCurrencies: ['KES', 'TZS'],
    minAmount: 10,
    maxAmount: 150000,
    dailyLimit: 300000,
    fees: { percentage: 0.5, flatFee: 0, currency: 'KES' },
  },
  {
    provider: 'mtn_momo',
    apiEndpoint: 'https://api.mtn.com/momo',
    supportedCountries: ['uganda', 'ghana', 'rwanda', 'nigeria'],
    supportedCurrencies: ['UGX', 'GHS', 'RWF', 'NGN'],
    minAmount: 500,
    maxAmount: 5000000,
    dailyLimit: 10000000,
    fees: { percentage: 1.0, flatFee: 0, currency: 'UGX' },
  },
  {
    provider: 'airtel_money',
    apiEndpoint: 'https://api.airtel.com/money',
    supportedCountries: ['kenya', 'uganda', 'tanzania', 'drc'],
    supportedCurrencies: ['KES', 'UGX', 'TZS', 'CDF'],
    minAmount: 100,
    maxAmount: 100000,
    dailyLimit: 200000,
    fees: { percentage: 0.8, flatFee: 50, currency: 'KES' },
  },
  {
    provider: 'orange_money',
    apiEndpoint: 'https://api.orange.com/money',
    supportedCountries: ['senegal', 'drc'],
    supportedCurrencies: ['XOF', 'CDF'],
    minAmount: 500,
    maxAmount: 2000000,
    dailyLimit: 5000000,
    fees: { percentage: 1.5, flatFee: 0, currency: 'XOF' },
  },
  {
    provider: 'ecocash',
    apiEndpoint: 'https://api.ecocash.co.zw',
    supportedCountries: ['south_africa'],
    supportedCurrencies: ['ZAR', 'USD'],
    minAmount: 1,
    maxAmount: 50000,
    dailyLimit: 100000,
    fees: { percentage: 2.0, flatFee: 0, currency: 'USD' },
  },
  {
    provider: 'chipper',
    apiEndpoint: 'https://api.chippercash.com',
    supportedCountries: ['kenya', 'nigeria', 'ghana', 'uganda', 'tanzania', 'rwanda', 'south_africa'],
    supportedCurrencies: ['KES', 'NGN', 'GHS', 'UGX', 'TZS', 'RWF', 'ZAR', 'USD'],
    minAmount: 1,
    maxAmount: 100000,
    dailyLimit: 500000,
    fees: { percentage: 0.5, flatFee: 0, currency: 'USD' },
  },
];

const BANK_TRANSFER_CONFIG: BankTransferConfig = {
  supportedCountries: ['kenya', 'nigeria', 'senegal', 'ethiopia', 'drc', 'tanzania', 'uganda', 'ghana', 'south_africa', 'rwanda'],
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'XOF', 'ETB', 'CDF', 'TZS', 'UGX', 'GHS', 'ZAR', 'RWF'],
  processingDays: 3,
  minAmount: 100,
  maxAmount: 1000000,
  fees: {
    domestic: {
      platformFee: 0,
      networkFee: 5,
      totalFees: 5,
      currency: 'USD',
    },
    international: {
      platformFee: 0,
      networkFee: 25,
      exchangeFee: 10,
      totalFees: 35,
      currency: 'USD',
    },
  },
};

const EXCHANGE_RATES: Record<string, number> = {
  'USD_KES': 153.50,
  'USD_NGN': 1550.00,
  'USD_XOF': 610.00,
  'USD_ETB': 56.50,
  'USD_CDF': 2750.00,
  'USD_TZS': 2520.00,
  'USD_UGX': 3750.00,
  'USD_GHS': 14.50,
  'USD_ZAR': 18.50,
  'USD_RWF': 1280.00,
  'EUR_USD': 1.08,
  'GBP_USD': 1.27,
};

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  destination: PaymentDetails;
  reference?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  reference?: string;
  fees: PaymentFees;
  amountSent: number;
  amountReceived: number;
  exchangeRate?: number;
  estimatedArrival?: string;
  error?: string;
}

export class PaymentRails {
  private daoId: string;

  constructor(daoId: string) {
    this.daoId = daoId;
    console.log(`[PaymentRails] Initialized for DAO: ${daoId}`);
  }

  getMobileMoneyProviders(jurisdiction: Jurisdiction): MobileMoneyConfig[] {
    return MOBILE_MONEY_CONFIGS.filter(config => 
      config.supportedCountries.includes(jurisdiction)
    );
  }

  getBankTransferConfig(): BankTransferConfig {
    return BANK_TRANSFER_CONFIG;
  }

  getExchangeRate(fromCurrency: string, toCurrency: string): number | null {
    if (fromCurrency === toCurrency) return 1;
    
    const directKey = `${fromCurrency}_${toCurrency}`;
    if (EXCHANGE_RATES[directKey]) {
      return EXCHANGE_RATES[directKey];
    }

    const inverseKey = `${toCurrency}_${fromCurrency}`;
    if (EXCHANGE_RATES[inverseKey]) {
      return 1 / EXCHANGE_RATES[inverseKey];
    }

    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      const fromToUsd = this.getExchangeRate(fromCurrency, 'USD');
      const usdToTo = this.getExchangeRate('USD', toCurrency);
      if (fromToUsd && usdToTo) {
        return fromToUsd * usdToTo;
      }
    }

    return null;
  }

  calculateFees(params: {
    amount: number;
    currency: string;
    method: PaymentMethod;
    provider?: MobileMoneyProvider;
    isDomestic: boolean;
  }): PaymentFees {
    let platformFee = 0;
    let networkFee = 0;
    let exchangeFee = 0;
    let withdrawalFee = 0;

    switch (params.method) {
      case 'crypto_wallet':
        networkFee = 2;
        platformFee = params.amount * 0.001;
        break;

      case 'mobile_money':
        if (params.provider) {
          const config = MOBILE_MONEY_CONFIGS.find(c => c.provider === params.provider);
          if (config) {
            platformFee = params.amount * (config.fees.percentage / 100);
            networkFee = config.fees.flatFee;
          }
        }
        break;

      case 'bank_transfer':
        const bankConfig = params.isDomestic 
          ? BANK_TRANSFER_CONFIG.fees.domestic 
          : BANK_TRANSFER_CONFIG.fees.international;
        platformFee = bankConfig.platformFee;
        networkFee = bankConfig.networkFee;
        exchangeFee = bankConfig.exchangeFee || 0;
        break;
    }

    return {
      platformFee: Math.round(platformFee * 100) / 100,
      networkFee: Math.round(networkFee * 100) / 100,
      exchangeFee: Math.round(exchangeFee * 100) / 100,
      withdrawalFee: Math.round(withdrawalFee * 100) / 100,
      totalFees: Math.round((platformFee + networkFee + exchangeFee + withdrawalFee) * 100) / 100,
      currency: params.currency,
    };
  }

  validatePayment(request: PaymentRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (request.amount <= 0) {
      errors.push('Amount must be greater than zero');
    }

    if (!request.destination.jurisdiction) {
      errors.push('Jurisdiction is required');
    }

    switch (request.method) {
      case 'mobile_money':
        if (!request.destination.provider) {
          errors.push('Mobile money provider is required');
        } else {
          const config = MOBILE_MONEY_CONFIGS.find(c => c.provider === request.destination.provider);
          if (!config) {
            errors.push('Unsupported mobile money provider');
          } else {
            if (request.amount < config.minAmount) {
              errors.push(`Minimum amount is ${config.minAmount} ${config.fees.currency}`);
            }
            if (request.amount > config.maxAmount) {
              errors.push(`Maximum amount is ${config.maxAmount} ${config.fees.currency}`);
            }
            if (!config.supportedCountries.includes(request.destination.jurisdiction)) {
              errors.push('Provider not available in this jurisdiction');
            }
          }
        }
        if (!request.destination.phoneNumber) {
          errors.push('Phone number is required for mobile money');
        }
        break;

      case 'bank_transfer':
        if (!request.destination.accountNumber) {
          errors.push('Account number is required');
        }
        if (!request.destination.bankCode && !request.destination.swiftCode) {
          errors.push('Bank code or SWIFT code is required');
        }
        if (request.amount < BANK_TRANSFER_CONFIG.minAmount) {
          errors.push(`Minimum amount is ${BANK_TRANSFER_CONFIG.minAmount} USD`);
        }
        if (request.amount > BANK_TRANSFER_CONFIG.maxAmount) {
          errors.push(`Maximum amount is ${BANK_TRANSFER_CONFIG.maxAmount} USD`);
        }
        break;

      case 'crypto_wallet':
        if (!request.destination.walletAddress) {
          errors.push('Wallet address is required');
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    console.log(`[PaymentRails] Processing payment: ${request.amount} ${request.currency}`);

    const validation = this.validatePayment(request);
    if (!validation.valid) {
      return {
        success: false,
        fees: this.calculateFees({
          amount: request.amount,
          currency: request.currency,
          method: request.method,
          provider: request.destination.provider,
          isDomestic: true,
        }),
        amountSent: request.amount,
        amountReceived: 0,
        error: validation.errors.join('; '),
      };
    }

    const isDomestic = request.currency === request.destination.localCurrency;
    const fees = this.calculateFees({
      amount: request.amount,
      currency: request.currency,
      method: request.method,
      provider: request.destination.provider,
      isDomestic,
    });

    let exchangeRate: number | undefined;
    let amountReceived = request.amount - fees.totalFees;

    if (request.destination.localCurrency && request.destination.localCurrency !== request.currency) {
      exchangeRate = this.getExchangeRate(request.currency, request.destination.localCurrency) || 1;
      amountReceived = amountReceived * exchangeRate;
    }

    const transactionId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    let estimatedArrival: string;
    const now = new Date();
    switch (request.method) {
      case 'crypto_wallet':
        estimatedArrival = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
        break;
      case 'mobile_money':
        estimatedArrival = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        break;
      case 'bank_transfer':
        estimatedArrival = new Date(now.getTime() + BANK_TRANSFER_CONFIG.processingDays * 24 * 60 * 60 * 1000).toISOString();
        break;
      default:
        estimatedArrival = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }

    console.log(`[PaymentRails] Payment processed: ${transactionId}`);

    return {
      success: true,
      transactionId,
      reference: request.reference,
      fees,
      amountSent: request.amount,
      amountReceived: Math.round(amountReceived * 100) / 100,
      exchangeRate,
      estimatedArrival,
    };
  }

  getSupportedJurisdictions(): Jurisdiction[] {
    return [
      'kenya', 'nigeria', 'senegal', 'ethiopia', 'drc',
      'tanzania', 'uganda', 'ghana', 'south_africa', 'rwanda'
    ];
  }

  getJurisdictionConfig(jurisdiction: Jurisdiction): {
    mobileMoneyProviders: MobileMoneyConfig[];
    bankTransferAvailable: boolean;
    currencies: string[];
    restrictions: string[];
  } {
    const mobileMoneyProviders = this.getMobileMoneyProviders(jurisdiction);
    const bankTransferAvailable = BANK_TRANSFER_CONFIG.supportedCountries.includes(jurisdiction);

    const currencyMap: Record<Jurisdiction, string[]> = {
      kenya: ['KES', 'USD'],
      nigeria: ['NGN', 'USD'],
      senegal: ['XOF', 'EUR', 'USD'],
      ethiopia: ['ETB', 'USD'],
      drc: ['CDF', 'USD'],
      tanzania: ['TZS', 'USD'],
      uganda: ['UGX', 'USD'],
      ghana: ['GHS', 'USD'],
      south_africa: ['ZAR', 'USD'],
      rwanda: ['RWF', 'USD'],
      other: ['USD'],
    };

    const restrictionMap: Record<Jurisdiction, string[]> = {
      kenya: ['KYC required for transactions > 70,000 KES'],
      nigeria: ['BVN verification required', 'Daily limit applies'],
      senegal: ['BCEAO compliance required'],
      ethiopia: ['NBE approval for foreign currency'],
      drc: ['BCC reporting for large transactions'],
      tanzania: ['TRA tax compliance'],
      uganda: ['URA clearance for business payments'],
      ghana: ['BOG compliance required'],
      south_africa: ['SARB reporting requirements'],
      rwanda: ['BNR compliance'],
      other: [],
    };

    return {
      mobileMoneyProviders,
      bankTransferAvailable,
      currencies: currencyMap[jurisdiction] || ['USD'],
      restrictions: restrictionMap[jurisdiction] || [],
    };
  }
}

export const createPaymentRails = (daoId: string): PaymentRails => {
  return new PaymentRails(daoId);
};
