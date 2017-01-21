//import regeneratorRuntime from 'regenerator-runtime'

const oo = function (str) {
  return function () {
    const root = (str && typeof str === 'string')
    ? new Ancestor(str)
    : (() => {
      throw new Error('Invalid input! Requires a non-empty string.')
    })()
    return root.html || new Error('Something went wrong. Root creation failed.')
  }
}


//export default oo

const dna = {
  child: {
      //img: null
  }
  , ancestor: {
    hr: '^-{3,}(\n+\s|$)',
    pre: '^`{3}\\w*\n[^]*\n`{3}(\n|$)',
    // list: null,
    blockquote: '^> .+(?:\n[^ ](?:> )?.+)*',
    h1: '^#{1,6} (.+\\S)'
  }
  , parent: {
    link: '^-{3,}(\n+\s|$)',
    // formatText: ''
  }
}

const genome = (() => {
  const output = {}

  for ( let group in dna ) {
    output[group] = []
    for ( let key in dna[group] ) {
      output[group].push(`${dna[group][key]}`)
    }
    output[group] = new RegExp( output[group].join('|'), 'gm' )
  }
  return output
})()

class Child {
  constructor ( input, phenotype='text', genotype='child' ) {
    this.input = input
  }

  get html () {
    return input
  }
}

class Ancestor extends Child {
  constructor ( input, phenotype='div', genotype='ancestor' ) {
    super( input, phenotype, genotype )
    this.tags = phenotype
    this.genes = genotype
    this.children = this.fertilize(input)
    //console.log(this.open, this.children, this.close, this.dna, this.genome)
  }

  *[Symbol.iterator]() {
    yield this.open
    yield this.children
    yield this.close
  }

  get html () {
    return [...this].join('')
  }

  set tags (phenotype) {
    [this.open, this.close] = phenotype !== 'hr'
    ? ['', '/'].map(x => `<${x}${phenotype}>`)
    : ['<hr>', '']
  }

  set genes (genotype) {
    this.dna = dna[genotype]
    this.genome = genome[genotype]
  }

  chromosome (str) {
    return str ? str.trimLeft() : ''
  }

  incubate (dna) {
    const children = this.genome.test(dna)
    ? [...dna.match(this.genome)]
    : [dna]
    return children.map(child => this.snipCord(child))
  }

  name (child) {
    const [names, chromosomes] = [
      Object.keys(this.dna)
      , Object.values(this.dna)
    ]
    const trait = chromosomes.map(seed => {
      return new RegExp(seed, 'g')
    }).map(seed => {
      return seed.test(child)
    }).indexOf(true)

    return trait > -1
      ? new Parent(child, names[trait])
      : new Child(child)
  }

  fertilize (str) {
    const dna = this.chromosome(str)
    return this.incubate(dna)
  }

  snipCord (str) {
    const child = str.trimRight()
    return this.name(child)
  }
}

class Parent extends Ancestor {
  constructor ( input, phenotype='p', genotype='parent' ) {
    super(input, phenotype, genotype)
  }
}


//console.log(new Ancestor('instantiated').snipCord('# heading\n'))
//console.log('Ancestor:', new Ancestor('test').html, '\nGrandparent:', new Grandparent('test').html)
 console.log(new Ancestor('# heading\n```\nstuff\nthings\n```\n# header').children[0])
