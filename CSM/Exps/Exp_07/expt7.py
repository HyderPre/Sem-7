import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

stock_data = pd.read_csv('tesla_dataset.csv')

plt.hist(stock_data['volume'], bins=100, density=True, alpha=0.7, color='g')
plt.title("Histogram of Tesla Stock Volumes")
plt.xlabel("Volume")
plt.ylabel("Density")
plt.show()

params_exp = stats.expon.fit(stock_data['volume'])
params_ln = stats.lognorm.fit(stock_data['volume'])

x_axis = np.linspace(min(stock_data['volume']), max(stock_data['volume']), 100)
pdf_exp = stats.expon.pdf(x_axis, *params_exp)
pdf_ln = stats.lognorm.pdf(x_axis, *params_ln)

plt.hist(stock_data['volume'], bins=100, density=True, alpha=0.6, color='gray')
plt.plot(x_axis, pdf_exp, 'r-', label="Exponential Fit")
plt.plot(x_axis, pdf_ln, 'b-', label="Log Normal Fit")
plt.title("Fitting Distributions to Volumes")
plt.xlabel("Volume")
plt.ylabel("Density")
plt.legend()
plt.show()

print(f"Exponential Fit Parameters (loc, scale): {params_exp}")
print(f"Log-Normal Fit Parameters (shape, loc, scale): {params_ln}")

ks_test_exp = stats.kstest(stock_data['volume'], 'expon', args=params_exp)
print(f"Kolmogorov-Smirnov test for Exponential: {ks_test_exp}")

ks_test_ln = stats.kstest(stock_data['volume'], 'lognorm', args=params_ln)
print(f"Kolmogorov-Smirnov test for Log Normal: {ks_test_ln}")

obs_counts, bin_edges = np.histogram(stock_data['volume'], bins=100)

exp_counts_exp = stats.expon.cdf(bin_edges[1:], *params_exp) - stats.expon.cdf(bin_edges[:-1], *params_exp)
exp_counts_ln = stats.lognorm.cdf(bin_edges[1:], *params_ln) - stats.lognorm.cdf(bin_edges[:-1], *params_ln)

exp_counts_exp *= len(stock_data['volume'])
exp_counts_ln *= len(stock_data['volume'])

exp_counts_exp *= obs_counts.sum() / exp_counts_exp.sum()
exp_counts_ln *= obs_counts.sum() / exp_counts_ln.sum()

chi2_exp = stats.chisquare(f_obs=obs_counts, f_exp=exp_counts_exp)
print(f"Chi-square test for Exponential: {chi2_exp}")

chi2_ln = stats.chisquare(f_obs=obs_counts, f_exp=exp_counts_ln)
print(f"Chi-square test for Log-Normal: {chi2_ln}")