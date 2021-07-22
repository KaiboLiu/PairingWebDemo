#### Folding for m6A sequences

1. data1 from [SI](https://static-content.springer.com/esm/art%3A10.1038%2Fs41594-019-0200-7/MediaObjects/41594_2019_200_MOESM1_ESM.pdf) of paper [RNA structure maps across mammalian cellular compartments](https://www.nature.com/articles/s41594-019-0200-7) (Lei Sun, et al. Nature 2019)


#### Folding results 
1. [data1](./m6A_LeiSun_SI_Nature_2019): Lei Sun, et al. Nature 2019, SI
```bash
./m6A_LeiSun_SI_Nature_2019
	├── HOXB9_m6A.ct
	├── HOXB9_m6A_fold.fasta
	├── NUP153_m6A.ct
	├── NUP153_m6A_fold.fasta
	├── SERBP1_m6A.ct
	├── SERBP1_m6A_fold.fasta
	├── SPRED2_m6A.ct
	└── SPRED2_m6A_fold.fasta
```

#### Raw data
1. data1: Lei Sun, et al. Nature 2019, SI

Protein | RNA_targeted | Sequence
-|-|-
IGF2BP3_88A    | SPRED2_A   |     CGAGGCACCAUUCCAGCCAGGGACGCUGCCGGGUA
IGF2BP3_88m6A  | **SPRED2_m6A** |     **CGAGGCACCAUUCCAGCCAGGG<span style='color: red'>m6A</span>CGCUGCCGGGUA**
IGF2BP3_88U    | SPRED2_U   |     CGAGGCACCAUUCCAGCCAGGGUCGCUGCCGGGUA
IGF2BP3_94A    | SERBP1_A   |     CACCUAAAGACUGAAUUUUAUCUGUUUUAAAAAUG
IGF2BP3_94m6A  | **SERBP1_m6A** |     **CACCUAAAG<span style='color: red'>m6A</span>CUGAAUUUUAUCUGUUUUAAAAAUG**
IGF2BP3_94U    | SERBP1_U   |     CACCUAAAGUCUGAAUUUUAUCUGUUUUAAAAAUG
LIN28A_53A     | NUP153_A   |     UUUGUUUUGGGAAGGACAGAAGAGAAACAG
LIN28A_53m6A   | **NUP153_m6A** |     **UUUGUUUUGGGAAGG<span style='color: red'>m6A</span>CAGAAGAGAAACAG**
LIN28A_53U     | NUP153_U   |     UUUGUUUUGGGAAGGUCAGAAGAGAAACAG
LIN28A_77A     | HOXB9_A | GACAAGUGGUCUGGGACAGGGAGGAGCAAC
LIN28A_77m6A   | **HOXB9_m6A**  |     **GACAAGUGGUCUGGG<span style='color: red'>m6A</span>CAGGGAGGAGCAAC**
LIN28A_77U     | HOXB9_U |  GACAAGUGGUCUGGGUCAGGGAGGAGCAAC

