- one
- two
- + two one
- + two two
- three
- + four
- + * five


5. one
2. two
2. 1. two one
2. 1. two two
3. three
3. 3. four
3. 1. 1. five


: Term
:: Definition
:: Definition
:: : Term
:: :: Definition


- [ ] not checked
- [x] checked


1. [ ] not checked
2. [x] checked


* one
* 1. one one
* 1. - one one one
* 1. - one one two
* 2. one two
* two
* - two one
* - two two


1. one
1. + one one
1. + 1. one one one
1. + 2. one one two
1. + one two
1. two
1. 1. two one
1. 2. two two


- one

but on multiple lines
- two
on multiple lines
- - two one

one multiple lines


-<<class-one class-two> one
- two
-<class> three
- -<<class> three one
- - three two


-<class-one class-two> one
- two
-<<class> three
- -<class> three one


1.<<class-one class-two> one
2.<class> two
3. three


1.<class> one
2.<<class-one class-two> two
3. three


:<<class-one class-two> one
::<class> one one
:<class> two
:: two two
: three
: :<<class> three one
: :: three one def