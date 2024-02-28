require 'cocos'


names = [
   '0-999',
   '1000-1999',
   '2000-2999',
   '3000-3999',
   '4000-4999',
   '5000-5999',
   '6000-6999',
   '7000-7999',
   '8000-8999',
   '9000-9899',
]

recs = []
names.each do |name|
    path = "./coolcats/#{name}.csv"
    recs += read_csv( path )
end


puts "   #{recs.size} record(s)"


## save as one
headers = recs[0].keys
File.open( "./coolcats/coolcats.csv", "w:utf-8" ) do |f|
   f.write( headers.join( ', '))
   f.write( "\n")
   recs.each do |rec|
     f.write( rec.values.join( ', ' ))
     f.write( "\n" )
   end
end



puts "bye"



__END__

names = [
    '0-999',
    '1000-1999',
    '2000-2999',
    '3000-3999',
    '4000-4999',
    '5000-5999',
    '6000-6999',
    '7000-7999',
    '8000-8999',
    '9000-9999',
]

recs = []
names.each do |name|
    path = "./original/#{name}.csv"
    recs += read_csv( path )
end


puts "   #{recs.size} record(s)"


## save as one
headers = recs[0].keys
File.open( "./original/cryptopunks.csv", "w:utf-8" ) do |f|
   f.write( headers.join( ', '))
   f.write( "\n")
   recs.each do |rec|
     f.write( rec.values.join( ', ' ))
     f.write( "\n" )
   end
end

