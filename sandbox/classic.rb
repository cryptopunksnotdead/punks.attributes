require 'cocos'


recs = read_csv( './original/cryptopunks.csv' )
puts "  #{recs.size} record(s)"


## remove gender, skin tone
##   convert type to   Male (Human Male)/Female (Human Female)/Zombie/Ape/Alien

headers = ['id', 'type', 'count', 'accessories']
File.open( "./original/cryptopunks-classic.csv", "w:utf-8" ) do |f|
   f.write( headers.join( ', '))
   f.write( "\n")
   recs.each do |rec|
     values = []
     values << rec['id']
     
     values <<   if rec['type'] == 'Human'
                     rec['gender']   ## Male/Female
                 else
                     rec['type']  ## Zombie/Ape/Alien
                 end

     values << rec['count']
     values << rec['accessories']

     f.write( values.join( ', ' ))
     f.write( "\n" )
   end
end


puts "bye"